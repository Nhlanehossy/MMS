// store/modules/resource.js
import axios from 'axios';

export default {
    namespaced: true,

    state: {
        items: [],
        loading: false,
        error: null,
        isGridMode: false
    },

    getters: {
        getItems: state => state.items,
        isLoading: state => state.loading,
        getError: state => state.error,
        isGridMode: state => state.isGridMode
    },

    mutations: {
        SET_ITEMS(state, items) {
            state.items = items;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_GRID_MODE(state, mode) {
            state.isGridMode = mode;
        },
        UPDATE_ITEM(state, updatedItem) {
            const index = state.items.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                state.items.splice(index, 1, updatedItem);
            }
        },
        ADD_ITEM(state, item) {
            state.items.push(item);
        }
    },

    actions: {
        async fetchItems({ commit }, resourceName) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resourceName}`);
                commit('SET_ITEMS', response.data.data);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', 'Failed to fetch items');
                console.error(error);
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async addItem({ commit }, { resourceName, formData }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_APP_API_URL}/api/v1/${resourceName}`,
                    formData
                );
                commit('ADD_ITEM', response.data);
                return response.data;
            } catch (error) {
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async updateItem({ commit }, { resourceName, formData }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_APP_API_URL}/api/v1/${resourceName}/${formData.id}`,
                    formData
                );
                commit('UPDATE_ITEM', response.data);
                return response.data;
            } catch (error) {
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        }
    }
};