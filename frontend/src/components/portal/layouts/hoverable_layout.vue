<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Logo from '../../u_i/sf_logo.vue';
import { getFilteredResources } from '../../../executables/accessControl';
import { getUserWithRole } from '../../../executables/getSanitizedUser';
import Swal from 'sweetalert2';

const sidebarExpanded = ref(false);
const profileDrawerOpen = ref(false);
const openMenuGroups = ref([]);
const userName = ref(null);
const avatarUrl = ref(null);
const userEmail = ref(null);
const userRole = ref(null);
const Resources = ref(null);
const user = ref(null);
const hoveredMenuGroup = ref(null);

const route = useRoute();
const router = useRouter();

const portalName = computed(() => {
  const segments = route.path.split('/');
  return segments.length > 1 ? segments[1] : '';
});

const menuGroups = computed(() => {
  if (!Resources.value) return [];
  const groups = {};
  for (const resource of Resources.value) {
    if (resource.menuGroup) {
      if (!groups[resource.menuGroup]) {
        groups[resource.menuGroup] = {
          name: resource.menuGroup,
          label: resource.menuGroup,
          icon: resource.menuGroupIcon,
          resources: [],
        };
      }
      groups[resource.menuGroup].resources.push(resource);
    }
  }
  return Object.values(groups);
});

const resourcesWithoutMenuGroup = computed(() =>
  Resources.value ? Resources.value.filter((resource) => !resource.menuGroup) : []
);

const handleResize = () => {
  // Adjust sidebar behavior based on screen size if needed
};

const isActive = (path) => route.path === path;

const toggleMenuGroup = (name) => {
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
    title: "Are you sure?",
    text: `Do you want to Logout?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Log me out!",
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
    router.push("/login");
    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: "logged out!",
    });
  } else {
    await Swal.fire({
      title: "Canceled",
      text: `You are still logged in.`,
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
    router.push("/login");
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

watch(() => route.path, () => {
  sidebarExpanded.value = false;
});
</script>

<template>
  <div class="flex h-screen text-text">
    <!-- Sidebar -->
    <div 
      class="bg-menubg text-textLighter h-screen flex flex-col transition-all duration-300 shadow-2xl fixed lg:static z-10 overflow-visible"
      :class="[sidebarExpanded ? 'w-52' : 'w-16']"
      @mouseenter="sidebarExpanded = true"
      @mouseleave="sidebarExpanded = false"
    >
      <!-- Sidebar Header -->
      <div class="p-4 flex items-center justify-between">
        <div class="w-full flex justify-center" v-if="sidebarExpanded">
          <Logo />
        </div>
      </div>
      <!-- Sidebar Links -->
      <nav class="flex-1 p-4 text-xs">
        <ul>
          <RouterLink :to="`/${portalName}`" class="block">
            <li :class="[
              'flex items-center p-2 rounded-md hover:bg-secondary hover:text-textLight transition duration-300',
              {
                'bg-backgroundHover text-textLight': isActive(`/${portalName}`),
              },
            ]">
              <i class="fa fa-home" :class="sidebarExpanded ? 'mr-2' : 'mr-0'"></i>
              <span v-if="sidebarExpanded">Home</span>
            </li>
          </RouterLink>
          <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
            <li 
              @click="toggleMenuGroup(menuGroup.name)" 
              @mouseenter="hoveredMenuGroup = menuGroup.name"
              @mouseleave="hoveredMenuGroup = null" 
              :class="[
                'flex items-center p-2 rounded-md hover:text-textLight cursor-pointer transition duration-300 relative',
                { 'text-textLight': isMenuGroupOpen(menuGroup.name) },
              ]"
            >
              <i :class="sidebarExpanded ? `mr-2 ${menuGroup.icon}` : `mr-0 ${menuGroup.icon}`"></i>
              <span v-if="sidebarExpanded">{{ menuGroup.label }}</span>
              <i v-if="sidebarExpanded" :class="[
                'fas ml-auto',
                isMenuGroupOpen(menuGroup.name) ? 'fa-chevron-down' : 'fa-chevron-right',
              ]"></i>
              <div v-if="!sidebarExpanded && hoveredMenuGroup === menuGroup.name"
                class="absolute left-full top-0 bg-menubg shadow-lg rounded-md p-2 ml-1 z-50"
                style="min-width: 200px; max-height: calc(100vh - 4rem); overflow-y: auto;">
                <ul>
                  <template v-for="resource in menuGroup.resources" :key="resource.name">
                    <RouterLink :to="{
                      path: resource.name,
                      query: {
                        page: 1,
                        limit: 30,
                        search: '',
                        sortBy: '',
                        order: 'desc',
                      },
                    }" class="block">
                      <li :class="[
                        'flex items-center p-2 rounded-md hover:bg-secondary hover:text-textLight transition duration-300 z-50',
                        {
                          'bg-backgroundHover text-textLight': isActive(`/${portalName}/${resource.name}`),
                        },
                      ]">
                        <i :class="resource.icon"></i>
                        <span>&nbsp;{{ resource.label }}</span>
                      </li>
                    </RouterLink>
                  </template>
                </ul>
              </div>
            </li>
            <ul v-if="isMenuGroupOpen(menuGroup.name) && sidebarExpanded">
              <template v-for="resource in menuGroup.resources" :key="resource.name">
                <a :href="`/${portalName}/${resource.name}`" class="block">
                  <li :class="[
                    'flex items-center p-2 rounded-md hover:bg-secondary hover:text-textLight transition duration-300',
                    {
                      'bg-backgroundHover text-textLight': isActive(`/${portalName}/${resource.name}`),
                      'pl-8': sidebarExpanded,
                    },
                  ]">
                    <i :class="resource.icon"></i>
                    <span>&nbsp;{{ resource.label }}</span>
                  </li>
                </a>
              </template>
            </ul>
          </template>
          <!-- Render resources without a menuGroup -->
          <template v-for="resource in resourcesWithoutMenuGroup" :key="resource.name">
            <RouterLink :to="{
              path: resource.name,
              query: {
                page: 1,
                limit: 30,
                search: '',
                sortBy: '',
                order: 'desc',
              },
            }" class="block">
              <li :class="[
                'flex items-center p-2 rounded-md hover:bg-secondary hover:text-textLight transition duration-300',
                {
                  'bg-primary text-textLight': isActive(`/${portalName}/${resource.name}`),
                },
              ]">
                <i :class="resource.icon"></i>
                <span v-if="sidebarExpanded">&nbsp;{{ resource.label }}</span>
              </li>
            </RouterLink>
          </template>

        </ul>
      </nav>
    </div>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col w-[100vw] overflow-x-scroll">
      <!-- Top Bar -->
      <div class="bg-secondary text-black p-2 flex items-center justify-between shadow-md">
        <div class="flex items-center">
          <!-- Profile section -->
          <div class="ml-4 relative">
            <button class="flex items-center text-black focus:outline-none hover:text-gray-400 transition duration-300"
              @click="openProfileDrawer">
              <img :src="avatarUrl" alt="Profile" class="rounded-full w-8 h-8 mr-2 shadow-md" />
              <span class="text-textLight text-xs font-bold">{{ userName }}</span>
              <i class="fas fa-chevron-down ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 shadow-inner bg-background overflow-y-auto transition-all duration-300">
        <!-- Your main content goes here -->
        <transition name="slide-fade" mode="out-in">
          <slot />
        </transition>
      </div>

      <!-- Profile Drawer -->
      <transition name="slide-fade">
        <div v-if="profileDrawerOpen" class="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Profile</h2>
              <button @click="closeProfileDrawer" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="mb-6">
              <img :src="avatarUrl" alt="Profile" class="w-32 h-32 rounded-full mx-auto mb-4">
              <h3 class="text-xl font-semibold text-center">{{ user?.fullname }}</h3>
            </div>
            <div class="mb-4">
              <p class="text-gray-600">Email: {{ user?.email }}</p>
              <p class="text-gray-600">Role: {{ user?.role }}</p>
            </div>
            <div class="flex justify-between">
              <RouterLink class="w-full" to="/${portalName}/profile">
                <button
                  class="w-full bg-secondary text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                  <i class="fas fa-cog mr-2"></i>
                  Settings
                </button>
              </RouterLink>
              <div class="mx-2"></div>
              <button @click="logout"
                class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
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

.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Ensure the sidebar is visible on larger screens */
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}

/* Adjustments for mobile view */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
}

/* New styles for hover functionality */
.sidebar {
  transition: width 0.3s ease;
}

.sidebar:hover {
  width: 52px !important;
}

.sidebar-content {
  width: 52px;
  overflow: hidden;
  transition: width 0.3s ease;
}

.sidebar:hover .sidebar-content {
  width: 208px;
}

.menu-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>