// store/index.js
import { createStore } from 'vuex';
import modal from './modules/modal';
import kanban from './modules/kanban';
import resource from './modules/resource';
import editDrawer from './modules/editDrawer';
// other modules...

const store = createStore({
  modules: {
    modal,
    kanban,
    resource,
    editDrawer
    // other modules...
  },
});

export default store;
