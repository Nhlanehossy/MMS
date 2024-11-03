<template>
  <div 
    class="kanban-column"
    @dragover.prevent 
    @drop="onDrop"
  >
    <div 
      class="kanban-header flex justify-between items-center mb-4 px-4 py-2 rounded-t-lg" 
      :style="{ backgroundColor: column.color || '#e5e7eb' }"
    >
      <div class="flex items-center space-x-3">
        <i :class="column.icon" class="text-xl text-white"></i>
        <h2 class="text-white">{{ column.title }}</h2>
      </div>

      <div class="actions bg-white rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <action_dispatcher :resource="{
            actions: [
              {
                name: 'edit',
                icon: 'pi pi-pencil',
                label: 'Edit',
              },
              {
                name: 'archive',
                icon: 'fa fa-archive',
                label: 'Archive',
              },
              {
                name: 'delete',
                icon: 'pi pi-trash',
                label: 'Delete',
              },
            ]
          }" :item="{}" orientation="icons" />
      </div>
    </div>

    <div class="task-list">
      <KanbanTask 
        v-for="task in column.tasks" 
        :key="task.id" 
        :task="task" 
        :columnId="column.id"
      />
    </div>
  </div>
</template>

<script>
import KanbanTask from './kanban_task.vue';
import action_dispatcher from '../../../action_dispatcher.vue';

export default {
  components: {
    KanbanTask,
    action_dispatcher
  },
  props: ['column'],
  methods: {
    onDrop(e) {
      const { taskId, fromColumn } = JSON.parse(e.dataTransfer.getData('text'));
      this.$emit('drop', { taskId, fromColumn, toColumn: this.column.id });
    }
  }
};
</script>

<style scoped>
.kanban-column {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  flex-grow: 1;
  height: auto;
  flex-basis: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.kanban-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 0.75rem 1rem;
  transition: background-color 0.3s ease;
  position: relative;
}

.kanban-header:hover .actions {
  opacity: 1;
}

h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.task-list {
  flex-grow: 1;
height: auto;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.actions {
  opacity: 0;
  transform: scale(0.9); /* Start slightly smaller */
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.actions.show {
  opacity: 1; /* Fully visible */
  transform: scale(1); /* Normal size */
  animation: popIn 0.3s forwards; /* Add animation */
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.9); /* Start slightly smaller */
  }
  100% {
    opacity: 1; /* Fully visible */
    transform: scale(1); /* Normal size */
  }
}


.kanban-header:hover .actions {
  opacity: 1;
}

i {
  color: white;
}
</style>
