<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { systemConfig } from '../../../data/system.config';
import { useRoute, useRouter } from 'vue-router';
import Logo from '../../u_i/sf_logo.vue';
import { getFilteredResources } from '../../../executables/accessControl';
import { getUserWithRole } from '../../../executables/getSanitizedUser';
import { translationKeys } from '@/executables/translation';
import Swal from 'sweetalert2';
import breadcrumbs from '../../breadcrumbs.vue';
import LanguageSelector from '../../language_selector.vue';
import themeCustomizer from '../../theme-customizer.vue'
import { CloseOutlined, MailOutlined, UserOutlined, SettingOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons-vue';
import notification_dropdown from './notification_dropdown.vue';
import ResourseSearchbar from '../../widgets/ResourseSearchbar.vue';
const sidebarState = ref(localStorage.getItem('sidebarState') || 'full');
const sidebarOpen = computed(() => sidebarState.value !== 'hidden');
const sidebarMinified = computed(() => sidebarState.value === 'minimized');
const profileDrawerOpen = ref(false);
const openMenuGroups = ref([]);
const userName = ref(null);
const avatarUrl = ref(null);
const userEmail = ref(null);
const userRole = ref(null);
const Resources = ref(null);
const user = ref(null);
const hoveredMenuGroup = ref(null);
const hoveredSubmenu = ref(false);

const portalName = computed(() => {
  const segments = route.path.split('/');
  return segments.length > 1 ? segments[1] : '';
});

const route = useRoute();
const router = useRouter();
const myQueryParam = ref(route.query.myParam);
const menuItems = computed(() => {
  if (!Resources.value) return [];

  // Sort resources to maintain original order
  return [...Resources.value].sort((a, b) => a.order - b.order);
});

// Add this to your props or compute it based on the current route
const windowWidth = ref(window.innerWidth);

const isMobile = computed(() => windowWidth.value < 1024);


const toggleSidebar = () => {
  if (sidebarState.value === 'hidden') {
    sidebarState.value = 'full';
  } else if (sidebarState.value === 'full') {
    sidebarState.value = 'hidden';
  } else if (sidebarState.value === 'minimized') {
    sidebarState.value = 'hidden';
  }
  localStorage.setItem('sidebarState', sidebarState.value);
};

const toggleSidebarMinified = () => {
  if (sidebarState.value === 'full') {
    sidebarState.value = 'minimized';
  } else if (sidebarState.value === 'minimized') {
    sidebarState.value = 'full';
  }
  localStorage.setItem('sidebarState', sidebarState.value);
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value >= 1024) {
    if (sidebarState.value === 'hidden') {
      sidebarState.value = 'full';
    }
  } else {
    sidebarState.value = 'hidden';
  }
  localStorage.setItem('sidebarState', sidebarState.value);
};

const isActive = (path) => {
  return route.path === path;
};

const toggleMenuGroup = (name) => {
  if (sidebarMinified.value) return;
  const index = openMenuGroups.value.indexOf(name);
  if (index === -1) {
    openMenuGroups.value = [name];
  } else {
    openMenuGroups.value.splice(index, 1);
  }
};

const isMenuGroupOpen = (name) => openMenuGroups.value.includes(name);

const openProfileDrawer = () => {
  profileDrawerOpen.value = true;
};

const closeProfileDrawer = () => {
  profileDrawerOpen.value = false;
};

const logout = async () => {
  const result = await Swal.fire({
    title: translationKeys.AreYouSure,
    text: translationKeys.DoYouWantToLogout,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: translationKeys.YesLogout,
  });
  if (result.isConfirmed) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("systemname");
    localStorage.removeItem("systemlogo");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("sidebarState");
    router.push("/login");
    await Swal.fire({
      icon: "success",
      title: translationKeys.Success,
      text: translationKeys.LoggedOut,
    });
  } else {
    await Swal.fire({
      title: translationKeys.Cancelled,
      text: translationKeys.StillLoggedIn,
      icon: "info",
    });
  }
};

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  handleResize();
  console.log(portalName.value)
  const roleId = localStorage.getItem("role");
  if (roleId) {
    try {
      const allResources = await getFilteredResources(roleId);
      // Find the current portal's resources
      const currentPortal = systemConfig.portals.find(portal => portal.url === `/${portalName.value}`);
      Resources.value = allResources.filter(resource =>
        currentPortal.resources.some(portalResource => portalResource.path === resource.path)
      );
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  }

  userName.value = localStorage.getItem("userName");
  avatarUrl.value = localStorage.getItem("userImage");
  userEmail.value = localStorage.getItem("userEmail");
  userRole.value = localStorage.getItem("role");

  const userId = localStorage.getItem('userId');
  if (userId) {
    try {
      user.value = await getUserWithRole(userId);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (!localStorage.getItem("userName")) {
    router.push("/");
  }



}


);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

watch(() => route.path, (path) => {
  if (window.innerWidth < 1024) {
    sidebarState.value = 'hidden';
    localStorage.setItem('sidebarState', sidebarState.value);
  }
});
</script>

<template>
  <div class="flex h-screen text-text">
    <!-- Sidebar -->
    <div :class="[
      'bg-cardLight text-textLighter h-screen flex flex-col transition-all duration-300 border-r-[1.5px] border-textLighter',
      'fixed lg:static',
      sidebarOpen ? (sidebarMinified ? 'w-16' : 'w-64') : 'w-0',
      'z-10 overflow-visible',
    ]">
      <template v-if="sidebarOpen">
        <!-- Sidebar Header -->
        <div class="p-4 flex items-center justify-between">
          <div class="w-full flex justify-center" v-if="!sidebarMinified">
            <Logo />
          </div>
          <button @click="toggleSidebarMinified"
            class="bg-primary text-textLight font-extrabold text-lg mt-5 px-4 py-1 ml-5 rounded-xl border-2 border-textLighter focus:outline-none  transition duration-300 lg:block hidden">
            <i :class="sidebarMinified ? 'pi pi-align-left' : 'pi pi-arrow-left'"></i>
          </button>
          <button @click="toggleSidebar"
            class="bg-primary text-textLighter font-extrabold text-lg mt-4 px-4 py-1 absolute ml-52 rounded-xl border-2 border-textLighter focus:outline-none transition duration-300 lg:hidden">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <!-- Sidebar Links -->
        <nav class="flex-1 p-4 text-sm font-sans">
          <a-skeleton v-if="isLoading" active :paragraph="{ rows: 6 }" />
          <ul v-else>
            <!-- Home link -->
            <RouterLink :to="{
              path: `/${portalName}`,
              query: {
                myParam: myQueryParam,
              }
            }" class="block text-text text-base font-medium common-text">
              <li :class="[
                'flex items-center p-2 text-text rounded-md hover:bg-cardDark hover:text-text transition duration-300',
                {
                  'text-primary': isActive(`/${portalName}`),
                },
              ]">
                <i class="fa fa-home text-base" :class="sidebarMinified ? 'mr-0' : 'mr-3'"></i>
                <span v-if="!sidebarMinified" class="font-medium common-text">{{ translationKeys.Home }}</span>
              </li>
            </RouterLink>


            <!-- Dynamic Menu Items -->
            <template v-for="(group, groupName) in menuItems.reduce((acc, item) => {
              if (!item.menuGroup) {
                acc['ungrouped'] = acc['ungrouped'] || [];
                acc['ungrouped'].push(item);
              } else {
                acc[item.menuGroup] = acc[item.menuGroup] || [];
                acc[item.menuGroup].push(item);
              }
              return acc;
            }, {})" :key="groupName">
              <!-- Ungrouped items -->
              <template v-if="groupName === 'ungrouped'">
                <template v-for="item in group" :key="item.name">
                  <RouterLink :to="{
                    path: `/${portalName}/${item.path}`,
                    query: {
                      myParam: myQueryParam,
                    },
                  }" class="block text-text text-base font-medium common-text">
                    <li :class="[
                      'flex items-center text-text p-2 rounded-md hover:bg-cardDark hover:text-text transition duration-300',
                      {
                        'text-primary': isActive(`/${portalName}/${item.path}`),
                      },
                    ]">
                      <i :class="[item.icon, 'text-base mr-3']"></i>
                      <span v-if="!sidebarMinified" class="font-medium common-text">&nbsp;{{ item.label }}</span>
                    </li>
                  </RouterLink>
                </template>
              </template>

              <!-- Grouped items -->
              <template v-else>
                <li @click="toggleMenuGroup(groupName)"
                  @mouseenter="hoveredMenuGroup = groupName; hoveredSubmenu = true" @mouseleave="hoveredSubmenu = false"
                  :class="[
                    'flex items-center p-2 rounded-md text-text  cursor-pointer transition duration-300 relative',
                    'bg-opacity-20 font-semibold',
                    {
                      'text-primary': !isMenuGroupOpen(groupName) && group.some(item => isActive(`/${portalName}/${item.path}`))
                    }
                  ]">
                  <i
                    :class="[sidebarMinified ? `mr-0 ${group[0].menuGroupIcon}` : `mr-3 ${group[0].menuGroupIcon}`, 'text-lg']"></i>
                  <span v-if="!sidebarMinified" class="common-text">{{ groupName }}</span>
                  <i v-if="!sidebarMinified" :class="[
                    'fas ml-auto text-text transition-transform duration-300',
                    isMenuGroupOpen(groupName) ? 'fa-chevron-down transform rotate-180' : 'fa-chevron-right',
                  ]"></i>

                  <!-- Dropdown for minimized sidebar -->
                  <transition name="scale" mode="out-in">
                    <div v-if="sidebarMinified && hoveredMenuGroup === groupName && hoveredSubmenu"
                      class="absolute left-full top-0 bg-cardLight border border-textLighter shadow-lg rounded-md p-2 ml-1 z-50"
                      style="min-width: 200px; max-height: calc(100vh - 4rem); overflow-y: auto;">
                      <ul class="text-sm">
                        <template v-for="item in group" :key="item.name">
                          <RouterLink :to="{
                            path: `/${portalName}/${item.path}`,
                            query: {
                              myParam: myQueryParam,
                            },
                          }" class="block text-text text-base font-medium common-text">
                            <li :class="[
                              'flex text-text items-center p-2 rounded-md hover:bg-cardDark hover:text-text transition duration-300 z-50',
                              {
                                'text-primary': isActive(`/${portalName}/${item.path}`),
                              },
                            ]">
                              <i :class="[item.icon, 'text-base']"></i>
                              <span class="font-medium common-text">&nbsp;{{ item.label }}</span>
                            </li>
                          </RouterLink>
                        </template>
                      </ul>
                    </div>
                  </transition>
                </li>

                <!-- Expanded view for grouped links -->
                <transition-group name="list" tag="ul">
                  <template v-if="isMenuGroupOpen(groupName) && !sidebarMinified">
                    <li v-for="item in group" :key="item.name">
                      <RouterLink :to="`/${portalName}/${item.path}`" class="block text-text font-medium common-text">
                        <div :class="[
                          'flex items-center p-2 text-text rounded-md hover:bg-cardDark hover:text-text transition duration-300',
                          {
                            'text-primary': isActive(`/${portalName}/${item.path}`),
                            'pl-8': !sidebarMinified,
                          },
                        ]">

                          <span class="font-medium common-text">&nbsp;{{ item.label }}</span>
                        </div>
                      </RouterLink>
                    </li>
                  </template>
                </transition-group>
              </template>
            </template>
          </ul>
        </nav>

      </template>
    </div>
    <!-- Main content area -->
    <div class="flex-1 flex flex-col w-[100vw] overflow-x-scroll">



      <!-- Top Bar -->
      <a-layout-header
        class="bg-cardLight text-black p-2 flex items-center justify-between border-b-[1.5px] border-textLighter">
        <div class="flex items-center">
          <a-button v-if="!sidebarOpen" type="text" @click="toggleSidebar"
            class="text-text hover:text-primary transition duration-300">
            <template #icon>
              <MenuOutlined />
            </template>
          </a-button>
          <div  class="h-5 ml-8 mt-0">
            <ResourseSearchbar/>
          </div>
        </div>
        <div class="flex items-center pl-1 mt-3 space-x-4">

          <!--      <themeCustomizer />  -->
    

  
          <a-avatar :src="avatarUrl" :size="34" @click="openProfileDrawer"
            class="cursor-pointer hover:opacity-80 transition duration-300 mr-2" />
            {{ user?.fullname }}
        </div>
      </a-layout-header>
      <!-- Main Content -->
      <div class=" flex-1 shadow-inner bg-background overflow-y-auto transition-all duration-300">
        <transition name="slide-fade" mode="out-in">
          <div>
            <breadcrumbs />
            <slot />
          </div>
        </transition>
      </div>

      <transition name="slide-fade">
        <a-drawer v-model:visible="profileDrawerOpen" :closable="false" placement="right" :width="450"
          class="profile-drawer border-l border-textLighter">
          <div class="profile-content">
            <div class="profile-header">
              <h2 class="text-lg font-semibold">{{ translationKeys.Profile }}</h2>
              <a-button type="text" @click="closeProfileDrawer">
                <template #icon>
                  <CloseOutlined />
                </template>
              </a-button>
            </div>

            <a-avatar :src="avatarUrl" :size="64" class="mb-4" />
            <h3 class="text-base font-medium">{{ user?.fullname }}</h3>
            <p class="text-sm text-gray-500 mb-6">{{ user?.role }}</p>

            <a-divider />

            <div class="mb-4">
              <h4 class="text-sm font-medium mb-2">{{ translationKeys.ContactInfo }}</h4>
              <p class="text-sm">
                <MailOutlined class="mr-2" />{{ user?.email }}
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium mb-2">{{ translationKeys.AccountDetails }}</h4>
              <p class="text-sm">
                <UserOutlined class="mr-2" />{{ translationKeys.Role }}: {{ user?.role }}
              </p>
            </div>

            <a-divider />

            <div class="profile-actions">
              <RouterLink :to="`/${portalName}/profile`">
                <a-button secondary block class="mb-2">
                  <template #icon>
                    <SettingOutlined />
                  </template>
                  {{ translationKeys.Settings }}
                </a-button>
              </RouterLink>
              <a-button danger block @click="logout">
                <template #icon>
                  <LogoutOutlined />
                </template>
                {{ translationKeys.Logout }}
              </a-button>
            </div>
          </div>
        </a-drawer>
      </transition>
    </div>
    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen && isMobile" class="fixed inset-0 bg-black bg-opacity-50 " @click="toggleSidebar">
    </div>

  </div>
</template>

<style scoped>
.profile-drawer {
  .ant-drawer-body {
    padding: 0;
  }
}

.profile-content {
  padding: 24px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.profile-actions {
  margin-top: 24px;
}
</style>
