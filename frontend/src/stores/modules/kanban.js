import { v4 as uuidv4 } from 'uuid';

const state = {
  columns: [
    { id: 'todo', title: 'To Do', tasks: [], color: '#FF6B6B', icon: 'pi pi-list' }, // A list icon for tasks to be done
    { id: 'inprogress', title: 'In Progress', tasks: [], color: '#FFD93D', icon: 'pi pi-spinner' }, // A spinner for ongoing tasks
    { id: 'done', title: 'Done', tasks: [], color: '#6BCB77', icon: 'pi pi-check-circle' }, // A check-circle for completed tasks
    
  ],
  users: ['User 1', 'User 2', 'User 3'],
  searchQuery: ''
};

const mutations = {  ADD_TASK(state, { columnId, task }) {
  const column = state.columns.find(col => col.id === columnId);
  column.tasks.push({
    id: uuidv4(),
    title: task.title,
    description: task.description,
    subtasks: task.subtasks,
    assignedTo: task.assignedTo
  });
},
UPDATE_TASK(state, { columnId, taskId, updates }) {
  const task = state.columns.find(col => col.id === columnId).tasks.find(t => t.id === taskId);
  Object.assign(task, updates);
},
  MOVE_TASK(state, { fromColumn, toColumn, taskId, newIndex }) {
    const task = state.columns.find(col => col.id === fromColumn).tasks.find(t => t.id === taskId);
    state.columns.find(col => col.id === fromColumn).tasks = state.columns.find(col => col.id === fromColumn).tasks.filter(t => t.id !== taskId);
    state.columns.find(col => col.id === toColumn).tasks.splice(newIndex, 0, task);
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  }
};

const actions = {
  addTask({ commit }, payload) {
    commit('ADD_TASK', payload);
  },
  moveTask({ commit }, payload) {
    commit('MOVE_TASK', payload);
  },
  updateTask({ commit }, payload) {
    commit('UPDATE_TASK', payload);
  },
  setSearchQuery({ commit }, query) {
    commit('SET_SEARCH_QUERY', query);
  }
};

const getters = {
  getColumns: (state) => state.columns,
  getUsers: (state) => state.users,
  filteredTasks: (state) => {
    const query = state.searchQuery.toLowerCase();
    return state.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.subtasks.some(subtask => subtask.toLowerCase().includes(query)) ||
        task.assignedTo.toLowerCase().includes(query)
      )
    }));
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};