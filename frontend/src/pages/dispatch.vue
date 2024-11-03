<template>
    <div>
      <ActionDispatcher :resource="{
        actions: [
          {
            name: 'OpenModal',
            icon: 'fa fa-eye',
            label: 'Open Modal'
          }
        ]
      }"
      
      :item="{
          modalType: 'YourModalType',
          modalData: {
            title: 'Your Modal Title',
            content: 'Your modal content goes here.',
            additionalInfo: 'Any additional information you want to pass',
          },
        }"
        
        orientation="buttons"
        />
  
      <div v-if="isModalOpen" class="modal-overlay" @click="hideModal">
        <div class="modal-content" @click.stop>
          <h2>{{ modalData.title }}</h2>
          <p>{{ modalData.content }}</p>
          <button @click="hideModal">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import action_dispatcher from '../components/action_dispatcher.vue';
  
  export default {
    components: {
      ActionDispatcher: action_dispatcher,
    },
    computed: {
      ...mapGetters('modal', ['isModalOpen', 'modalData']),
    },
    methods: {
      ...mapActions('modal', ['hideModal']),
      async dispatchAction() {
        // Define your payload here, adjust as necessary
        const payload = {
          modalType: 'YourModalType', // The type of the modal you want to open
          modalData: 'Your data for the modal', // Any data you want to pass to the modal
        };
  
        // Dispatch the action using the ActionDispatcher
        const actionConfig = this.$store.getters['resourceFunctions'].find(action => action.key === 'OpenModal');
        if (actionConfig) {
          await actionConfig.value({ dispatch: this.$store.dispatch }, payload);
        }
      },
    },
  };
  </script>
  