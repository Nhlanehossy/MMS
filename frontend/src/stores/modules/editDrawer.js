// store/modules/editDrawer.js
export default {
  namespaced: true,
  state: {
    isEditDrawerOpen: false,
    currentItem: null,
  },
  mutations: {
    OPEN_EDIT_DRAWER(state) {
      state.isEditDrawerOpen = true;
    },
    CLOSE_EDIT_DRAWER(state) {
      state.isEditDrawerOpen = false;
    },
    SET_CURRENT_ITEM(state, item) {
      state.currentItem = item;
    },
  },
  actions: {
    openEditDrawer({ commit }) {
      commit('OPEN_EDIT_DRAWER');
    },
    closeEditDrawer({ commit }) {
      commit('CLOSE_EDIT_DRAWER');
      commit('SET_CURRENT_ITEM', null);
    },
  },
  getters: {
    isEditDrawerOpen: (state) => state.isEditDrawerOpen,
    currentItem: (state) => state.currentItem,
  },
};