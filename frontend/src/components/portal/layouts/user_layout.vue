<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Logo from '../../u_i/sf_logo.vue';
import { getFilteredResources } from '../../../executables/accessControl';
import { getUserWithRole } from '../../../executables/getSanitizedUser';
import Swal from 'sweetalert2';

const menuOpen = ref(false);
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

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const isActive = (path) => route.path === path;

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
  const roleId = localStorage.getItem("role");
  if (roleId) {
    try {
      Resources.value = await getFilteredResources(roleId);
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

watch(() => route.path, () => {
  menuOpen.value = false;
});
</script>

<template>
  <div class="flex flex-col min-h-screen text-text bg-background">
    <!-- Header -->
    <header class="bg-secondary text-textLight p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="w-44">
          <Logo />
        </div>
        <div class="flex items-center">
          <button @click="toggleMenu" class="mr-4 focus:outline-none">
            <i class="fas fa-bars text-2xl"></i>
          </button>
          <div class="relative">
            <button @click="openProfileDrawer" class="flex items-center focus:outline-none">
              <img :src="avatarUrl" alt="Profile" class="w-8 h-8 rounded-full mr-2" />
              <span class="font-bold">{{ userName }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Menu (Stacked) -->
    <nav v-show="menuOpen" class="bg-menubg text-textLighter p-4">
      <ul class="space-y-2">
        <li>
          <RouterLink :to="`/dashboard`" class="block p-2 hover:bg-secondary hover:text-textLight rounded transition duration-300" :class="{ 'bg-backgroundHover text-textLight': isActive(`/dashboard`) }">
            <i class="fa fa-home mr-2"></i>
            <span>Home</span>
          </RouterLink>
        </li>
        <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
          <li>
            <button @click="toggleMenuGroup(menuGroup.name)" class="w-full text-left p-2 hover:bg-secondary hover:text-textLight rounded transition duration-300 flex justify-between items-center">
              <span><i :class="menuGroup.icon + ' mr-2'"></i>{{ menuGroup.label }}</span>
              <i :class="['fas', isMenuGroupOpen(menuGroup.name) ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
            </button>
            <ul v-if="isMenuGroupOpen(menuGroup.name)" class="ml-4 mt-2 space-y-2">
              <li v-for="resource in menuGroup.resources" :key="resource.name">
                <RouterLink :to="{path: resource.name, query: { page: 1, limit: 30, search: '', sortBy: '', order: 'desc' } }" class="block p-2 hover:bg-secondary hover:text-textLight rounded transition duration-300" :class="{ 'bg-backgroundHover text-textLight': isActive(`/dashboard/${resource.name}`) }">
                  <i :class="resource.icon + ' mr-2'"></i>
                  <span>{{ resource.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>
        </template>
        <template v-for="resource in resourcesWithoutMenuGroup" :key="resource.name">
          <li>
            <RouterLink :to="{path: resource.name, query: { page: 1, limit: 30, search: '', sortBy: '', order: 'desc' } }" class="block p-2 hover:bg-secondary hover:text-textLight rounded transition duration-300" :class="{ 'bg-backgroundHover text-textLight': isActive(`/dashboard/${resource.name}`) }">
              <i :class="resource.icon + ' mr-2'"></i>
              <span>{{ resource.label }}</span>
            </RouterLink>
          </li>
        </template>
        <li>
          <RouterLink :to="`/dashboard/profile`" class="block p-2 hover:bg-secondary hover:text-textLight rounded transition duration-300" :class="{ 'bg-backgroundHover text-textLight': isActive(`/dashboard/profile`) }">
            <i class="fa fa-cog mr-2"></i>
            <span>Profile settings</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <transition name="fade" mode="out-in">
        <slot/>
      </transition>
    </main>

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
            <RouterLink class="w-full" to="/dashboard/profile">
              <button class="w-full bg-secondary text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                <i class="fas fa-cog mr-2"></i>
                Settings
              </button>
            </RouterLink>
            <div class="mx-2"></div>
            <button @click="logout" class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
              <i class="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>