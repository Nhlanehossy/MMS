<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { systemConfig } from '../../../data/system.config';
import { useRoute, useRouter } from 'vue-router';
import Logo from '../../u_i/sf_logo.vue';
import { getFilteredResources } from '../../../executables/accessControl';
import { getUserWithRole } from '../../../executables/getSanitizedUser';
import { translationKeys } from '@/executables/translation';
import Swal from 'sweetalert2';
import breadcrumbs from '../../breadcrumbs.vue';
import LanguageSelector from '../../language_selector.vue';
import themeCustomizer from '../../theme-customizer.vue';
import notifications_dropdown from '../render_modes/notifications/notifications_dropdown.vue';

const drawerOpen = ref(true);
const profileDrawerOpen = ref(false);
const openMenuGroups = ref([]);
const userName = ref(null);
const avatarUrl = ref(null);
const userEmail = ref(null);
const userRole = ref(null);
const Resources = ref(null);
const user = ref(null);

const route = useRoute();
const router = useRouter();

const portalName = computed(() => {
  const segments = route.path.split('/');
  return segments.length > 1 ? segments[1] : '';
});

const menuItems = computed(() => {
  if (!Resources.value) return [];

  const sortedResources = [...Resources.value].sort((a, b) => a.order - b.order);

  // First, group by resourceGroup
  const groupedByResourceGroup = {};
  sortedResources.forEach(resource => {
    const group = resource.resourceGroup || 'Ungrouped';
    if (!groupedByResourceGroup[group]) {
      groupedByResourceGroup[group] = [];
    }
    groupedByResourceGroup[group].push(resource);
  });

  // Then, process each resourceGroup
  return Object.entries(groupedByResourceGroup).map(([groupName, resources]) => {
    const processedItems = [];
    const menuGroups = {};

    resources.forEach(resource => {
      if (resource.menuGroup) {
        if (!menuGroups[resource.menuGroup]) {
          menuGroups[resource.menuGroup] = {
            type: 'menuGroup',
            name: resource.menuGroup,
            label: resource.menuGroup,
            icon: resource.menuGroupIcon,
            resources: []
          };
          processedItems.push(menuGroups[resource.menuGroup]);
        }
        menuGroups[resource.menuGroup].resources.push(resource);
      } else {
        processedItems.push({
          type: 'resource',
          ...resource
        });
      }
    });

    return {
      resourceGroup: groupName,
      items: processedItems
    };
  });
});



const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const isActive = (path) => {
  return route.name === `${portalName.value}-${path}`;
};

const toggleMenuGroup = (name) => {
  const index = openMenuGroups.value.indexOf(name);
  if (index === -1) {
    openMenuGroups.value.push(name);
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
    localStorage.removeItem("role");
    localStorage.removeItem("userImage");
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
  const roleId = localStorage.getItem("role");
  if (roleId) {
  try {
    let allResources = await getFilteredResources(roleId);

    // Include only resources that have an action with action.name === 'goToView'
    allResources = allResources.filter(resource => 
      resource.actions.some(action => action.name === 'goToView')
    );

    const currentPortal = systemConfig.portals.find(
      portal => portal.url === `/${portalName.value}`
    );

    // Further filter the resources to match the current portal's resources
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
});


</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- Top Bar -->
    <div class="flex admin-top-bar items-center justify-between">
      <div class="flex items-center">
        <div @click="toggleDrawer">
          <i class="fas fa-bars menu-icon"></i>
        </div>
        <div class="logo-container">
              <Logo />
            </div>
      </div>
      <div class="flex items-center">
      <LanguageSelector class="language-selector" />
      <div class="mr-4"><themeCustomizer/></div>
        <div class="mr-4"><notifications_dropdown/></div>
        <div @click="openProfileDrawer" class="profile-container">
          <img :src="avatarUrl" alt="Profile" class="profile-image" />
          <div class="profile-info">
            <span class="profile-name">{{ userName }}</span>
       
          </div>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex overflow-hidden">
      <!-- Drawer -->
      <div :class="['admin-side-bar bg-black', { 'minimized': !drawerOpen, 'open': drawerOpen }]">
        <template v-if="drawerOpen">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between border-b border-primary">
              
          </div>

          <!-- Drawer Links -->
          <nav class="flex flex-col p-4 justify-start items-start">
            <ul class="flex flex-col space-y-1 justify-start w-full">
              <RouterLink :to="`/dashboard`">
                <li class="flex items-center p-2">
                  <i class="pi pi-home mr-2"></i>
                  <span>{{ translationKeys.Home }}</span>
                </li>
              </RouterLink>

              <template v-for="group in menuItems" :key="group.resourceGroup">
                <li class="resource-group-header"><i class="fa-solid fa-play mr-1"></i>{{ group.resourceGroup }}</li>
                <template v-for="item in group.items" :key="item.name || item.path">
                  <!-- Standalone resource -->
                  <RouterLink v-if="item.type === 'resource'" :to="`/${portalName}/${item.path}`">
                    <li class="flex items-center p-2">
                      <i :class="`${item.icon} mr-2`"></i>
                      <span>{{ item.label }}</span>
                    </li>
                  </RouterLink>

                  <!-- Menu group -->
                  <template v-else-if="item.type === 'menuGroup'">
                    <li @click="toggleMenuGroup(item.name)" class="flex items-center menu-group-item p-2">
                      <i :class="['fas ml-2', isMenuGroupOpen(item.name) ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
                      <i :class="`${item.icon} mr-2`"></i>
                      <span>{{ item.label }}</span>
                    </li>
                    <ul v-if="isMenuGroupOpen(item.name)">
                      <template v-for="resource in item.resources" :key="resource.name">
                        <RouterLink :to="`/${portalName}/${resource.path}`">
                          <li class="flex items-center p-2 pl-8">
                            <i :class="`${resource.icon} mr-2`"></i>
                            <span>{{ resource.label }}</span>
                          </li>
                        </RouterLink>
                      </template>
                    </ul>
                  </template>
                </template>
              </template>
            </ul>
          </nav>
        </template>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto">
        <transition name="slide-fade" mode="out-in">
          <div>
            <breadcrumbs />
            <slot />
          </div>
        </transition>
      </div>

      <!-- Profile Drawer -->
      <transition name="slide-fade">
        <div v-if="profileDrawerOpen" class="profile-drawer fixed inset-y-0 right-0 w-80">
          <div class="profile-content p-6">
            <div class="profile-header flex justify-between items-center mb-6">
              <h2 class="profile-title">{{ translationKeys.Profile }}</h2>
              <button @click="closeProfileDrawer" class="close-button">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="profile-info mb-6">
              <img :src="avatarUrl" alt="Profile" class="profile-avatar w-32 h-32 rounded-full mx-auto mb-4">
              <h3 class="profile-name">{{ user?.fullname }}</h3>
            </div>
            <div class="profile-details mb-4">
              <p class="profile-email">{{ translationKeys.Email }}: {{ user?.email }}</p>
              <p class="profile-role">{{ translationKeys.Role }}: {{ user?.role }}</p>
            </div>
            <div class="profile-actions flex justify-between">
              <RouterLink class="settings-link w-full" :to="`/${portalName}/profile`">
                <button class="settings-button w-full">
                  <i class="fas fa-user mr-2"></i>
                  {{ translationKeys.Profile }}
                </button>
              </RouterLink>
              <div class="mx-2"></div>
              <button @click="logout" class="logout-button w-full">
                <i class="fas fa-sign-out-alt mr-2"></i>
                {{ translationKeys.Logout }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>


<style scoped>

.menu-icon{
  color: black;
}

/* Slide transition styles */
.slide-fade-enter-active {
  animation: slideFadeEnter 0.5s ease both;
}

.slide-fade-leave-active {
  animation: slideFadeLeave 0.5s ease both;
}

@keyframes slideFadeEnter {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFadeLeave {
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}


.resource-group-header {
  font-weight: 800;
  padding-left: 12px;
  padding-top: 15px;
  color:var(--primary);
  text-transform: uppercase;
  font-size: 0.9em;
  list-style: none;
  
}
</style>
