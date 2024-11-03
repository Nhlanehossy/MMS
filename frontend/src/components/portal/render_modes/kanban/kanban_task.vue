<template>
  <div 
    class="kanban-task" 
    draggable="true"
    @dragstart="onDragStart"
    @click="openEditModal"
  >
    <h3>{{ task.title }}</h3>
    <p>{{ task.description }}</p>
    <div v-if="task.subtasks.length > 0" class="subtasks">
      <strong>Subtasks:</strong>
      <ul>
        <li v-for="(subtask, index) in task.subtasks" :key="index">
          <input type="checkbox" v-model="subtask.done" @change="updateSubtask(index)">
          <span :class="{ 'completed': subtask.done }">{{ subtask.text }}</span>
        </li>
      </ul>
    </div>
    <div class="assigned-users">
      <strong>Assigned to:</strong>
      <span v-for="user in task.assignedTo" :key="user" class="user-tag">{{ user }}</span>
    </div>
    <button @click.stop="openProgressModal" class="progress-btn">View Progress</button>
    <EditTaskModal 
      v-if="showEditModal"
      :task="task"
      :columnId="columnId"
      @close="showEditModal = false"
      @update-task="updateTask"
    />
    <TaskProgressModal
      v-if="showProgressModal"
      :task="task"
      @close="showProgressModal = false"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapActions } from 'vuex';
import EditTaskModal from './edit_task_modal.vue';
import TaskProgressModal from './task_progress_modal.vue';
import { toast } from 'vue3-toastify';
import action_dispatcher from '../../../action_dispatcher.vue';

export default {
  components: {
    EditTaskModal,
    TaskProgressModal,
  },
  props: ['task', 'columnId'],
  setup() {
    const showEditModal = ref(false);
    const showProgressModal = ref(false);
    return { showEditModal, showProgressModal };
  },
  methods: {
    ...mapActions('kanban', ['updateTask']),
    openEditModal() {
      this.showEditModal = true;
    },
    openProgressModal() {
      this.showProgressModal = true;
    },
    onDragStart(e) {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        taskId: this.task.id,
        fromColumn: this.columnId
      }));
    },
    updateTask(updates) {
      this.updateTask({ columnId: this.columnId, taskId: this.task.id, updates });
      this.showEditModal = false;
      toast.success('Task updated successfully!');
    },
    updateSubtask(index) {
      const updatedSubtasks = [...this.task.subtasks];
      updatedSubtasks[index].done = !updatedSubtasks[index].done;
      this.updateTask({ subtasks: updatedSubtasks });
    }
  }
};
</script>

<style scoped>
.kanban-task {
  background-color: #ffffff;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: move;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.kanban-task:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

h3 {
  margin-top: 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.subtasks ul {
  padding-left: 1.25rem;
  margin-top: 0.5rem;
}

.subtasks li {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.subtasks input[type="checkbox"] {
  margin-right: 0.5rem;
}

.completed {
  text-decoration: line-through;
  color: #6b7280;
}

.assigned-users {
  margin-top: 1rem;
}

.user-tag {
  display: inline-block;
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
  font-size: 0.875rem;
}

.progress-btn {
  margin-top: 1rem;
  padding: 0.375rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.progress-btn:hover {
  background-color: #2563eb;
}
</style>