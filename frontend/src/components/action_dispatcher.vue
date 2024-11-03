<template>
  <div class="action-dispatcher">
    <!-- Dropdown orientation (default) -->
    <a-dropdown v-if="orientation === 'dropdown'" :trigger="['click']">
      <a-button class="action-dropdown" type="text">
        <i class="pi pi-ellipsis-h text-textLighter"></i>
      </a-button>
      <template #overlay>
        <a-menu class="custom-dropdown-menu">
          <ActionMenuItem v-for="action in filteredActions" :key="action.name" :action="action" :item="item"
            @action-click="handleAction" />
        </a-menu>
      </template>
    </a-dropdown>

    <!-- Buttons orientation -->
    <div v-else-if="orientation === 'buttons'" class="flex space-x-2">
      <a-button v-for="action in filteredActions" :key="action.name"
        :type="action.name === 'deleteResource' ? 'danger' : 'primary'"
        @click="handleAction(item, action.name)"
         :style="{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }"
        >
        <i :class="[action.icon, 'mr-2']"></i>
        {{ action.label }}
      </a-button>
      
    </div>

    <!-- Icons or ientation -->
    <div v-else-if="orientation === 'icons'" class="flex space-x-5">
      <a-tooltip v-for="action in filteredActions" :key="action.name" :title="action.label">
        <i shape="circle"
          :class="action.name === 'deleteResource' ? `action-icon ${action.icon}` : `action-icon ${action.icon}`"
          @click="handleAction(item, action.name)"></i>
      </a-tooltip>
    </div>

    <!-- Modal orientation -->
    <div v-else-if="orientation === 'modal'">
      <span class="hover:cursor-pointer text-xl" @click="showModal = true">
        <i class="pi pi-ellipsis-v"></i>
      </span>
      <a-modal v-model:visible="showModal" title="Select An Action" :cancellable="false" @ok="showModal = false">
        <a-list item-layout="horizontal" :data-source="filteredActions">
          <template #renderItem="{ item: action }">
            <a-list-item @click="handleAction(item, action.name)">
              <a-list-item-meta>
                <template #title>
                  <span :class="{ 'text-red-600': action.name === 'deleteResource' }">
                    <i :class="[action.icon, 'mr-2']"></i>
                    {{ action.label }}
                  </span>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-modal>
    </div>

    <!-- List orientation -->
    <a-list v-else-if="orientation === 'list'" item-layout="horizontal" :data-source="filteredActions">
      <template #renderItem="{ item: action }">
        <a-list-item @click="handleAction(item, action.name)">
          <a-list-item-meta>
            <template #title>
              <span :class="{ 'text-red-600': action.name === 'deleteResource' }">
                <i :class="[action.icon, 'mr-2']"></i>
                {{ action.label }}
              </span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <!-- Grid orientation -->
    <div v-else-if="orientation === 'grid'" class="grid grid-cols-3  gap-y-2">
      <span v-for="action in filteredActions" :key="action.name"
        :color="action.name === 'deleteResource' ? 'danger' : 'primary'" @click="handleAction(item, action.name)"
        class="flex cursor-pointer flex-col items-center justify-center p-2">
        <i :class="[action.icon, 'text-xl mt-5 text-secondary mb-1']"></i>
        <span class="text-xs">{{ action.label }}</span>
      </span>
    </div>

    <!-- Floating Action Button orientation -->
    <div v-else-if="orientation === 'fab'" class="fab-container">
      <a-button @click="toggleFab" class="fab-button" :class="{ 'fab-open': isFabOpen }">
        <i :class="isFabOpen ? 'pi pi-times' : 'pi pi-plus'"></i>
      </a-button>
      <transition-group name="fab-actions" tag="div" class="fab-actions">
        <a-button v-for="action in filteredActions" :key="action.name" v-show="isFabOpen"
          @click="handleAction(item, action.name)" class="fab-action-button">
          <i :class="[action.icon]"></i>
        </a-button>
      </transition-group>
    </div>

    <!-- Alternative Floating Action Button orientation -->
    <div v-else-if="orientation === 'alt-fab'" class="fab-container">
      <transition-group name="fab-actions" tag="div" class="fab-actions">
        <a-button v-for="action in filteredActions" :key="action.name" @click="handleAction(item, action.name)"
          class="fab-action-button">
          <i :class="[action.icon]"></i>
        </a-button>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import resourceFunctions from '../executables/actions';
import ActionMenuItem from './action_menu_item.vue';
import { useRouter, useRoute } from 'vue-router';


export default {
  name: 'ActionDispatcher',
  components: {
    ActionMenuItem
  },
  props: {
    resource: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    orientation: {
      type: String,
      default: 'dropdown',
      validator: (value) => ['dropdown', 'buttons', 'icons', 'modal', 'list', 'grid', 'fab', 'alt-fab'].includes(value)
    }
  },
  setup(props) {
    const loading = ref(false);
    const showModal = ref(false);
    const isFabOpen = ref(false);
    const router = useRouter();
    const route = useRoute();
    const filteredActions = computed(() =>
      props.resource.actions.filter(a => a.name !== 'createResource')
    );



    const handleAction = async (item, actionName) => {
      loading.value = true;
      try {
        const actionConfig = resourceFunctions.find(action => action.key === actionName);
    // Get path from window.location
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    const firstPathSegment = currentPath.split('/')[1];
    console.log('First path segment:', firstPathSegment);
    

        if (actionConfig && typeof actionConfig.value === 'function') {
          await actionConfig.value({
            resource: props.resource.name,
            fullResource: props.resource,
            path: props.resource.path,
            id: item._id || item.id,
            data: item,
            mode: props.resource.renderMode,
            router: router,
            route: firstPathSegment  // Add the new parameter here
          });
          console.log(`Action ${actionName} performed successfully`);
        } else {
          console.warn(`Handler for action '${actionName}' is not a function or not found`);
        }
      } catch (error) {
        console.error(`Error performing action ${actionName}:`, error.message);
      } finally {
        loading.value = false;
        showModal.value = false;
        isFabOpen.value = false;
      }
    };

    const toggleFab = () => {
      isFabOpen.value = !isFabOpen.value;
    };

    return {
      loading,
      showModal,
      isFabOpen,
      filteredActions,
      handleAction,
      toggleFab
    };
  }
};
</script>

<style scoped>
.action-dispatcher {
  z-index: 999;
}

button {
  color: white;
}

.action-dropdown {
  font-size: 1.2rem;
  color: black;
  background-color: transparent;
  border-radius: 100%;
  padding: 0px;
}



.action-dropdown:hover {
  color: var(--menubg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0);
}

.custom-dropdown-menu {
  min-width: 160px;
}

/* Floating Action Button Styles */
.fab-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.fab-button {
  width: 56px;
  height: 90px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.fab-button.fab-open {
  transform: rotate(45deg);
}

.fab-actions {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}

.fab-action-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.fab-action-button:hover {
  transform: scale(1.1);
}

.fab-actions-enter-active,
.fab-actions-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fab-actions-enter-from,
.fab-actions-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Styles for the alternative FAB */
.fab-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.fab-action-button {
  margin-bottom: 10px;
  /* Space between buttons */
}
</style>
