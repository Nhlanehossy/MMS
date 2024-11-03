const state = {
  isModalOpen: false,
  modalData: null,
  modalType: null,
};

const mutations = {
  SHOW_MODAL(state, { modalType, modalData }) {
    state.isModalOpen = true;
    state.modalData = modalData;
    state.modalType = modalType;
  },
  HIDE_MODAL(state) {
    state.isModalOpen = false;
    state.modalData = null;
    state.modalType = null;
  },
};

const actions = {
  showModal({ commit }, { modalType, modalData }) {
    commit('SHOW_MODAL', { modalType, modalData });
  },
  hideModal({ commit }) {
    commit('HIDE_MODAL');
  },
};

const getters = {
  isModalOpen: (state) => state.isModalOpen,
  modalData: (state) => state.modalData,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
