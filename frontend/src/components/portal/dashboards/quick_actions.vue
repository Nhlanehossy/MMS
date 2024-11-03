<template>
  <div class="max-w-full my-6"> 
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">{{ translationKeys.QuickActions }}</h2>
      <action_dispatcher :resource="{
            actions:[
              {
                name: 'SeeArchivedActions',
                icon: 'fa fa-archive',
                label: 'See Archived Actions',
              },
        ]
      }" 
        :item="{}"  
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      <div class="card" v-for="(action, index) in visibleActions" :key="index">
       
        <router-link :to="`/dashboard/${action.path}`" class="block group">
          <span class="flex p-0 m-0 justify-between w-full">

          </span>
          <div class=" text-text flex items-center justify-between">
            <div class="flex items-center">
              <i :class="action.icon + ' p-2 mr-4'"></i>
              <span>{{ action.label }}</span>
            </div>
            <i class="fas fa-chevron-right"></i>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="showLoadMoreButton && !allLoaded" class="text-center mt-4">
      <button @click="loadMore" class="flex items-center justify-center">
        <i class="fas fa-arrow-down mr-2"></i>
        Load More
      </button>
    </div>
  </div>
</template>

  
  <script>
  import { translationKeys } from '@/executables/translation';
  import action_dispatcher from '../../action_dispatcher.vue';
  export default {
    props: {
      actions: {
        type: Array,
        required: true
      },
      limit: {
        type: Number,
        default: 6
      }
    },
    components: { action_dispatcher },
    data() {
      return {
        loadedCount: this.limit,
        allLoaded: false,
        translationKeys: translationKeys
      };
    },
    computed: {
      visibleActions() {
        return this.actions.slice(0, this.loadedCount);
      },
      showLoadMoreButton() {
        return !this.allLoaded && this.loadedCount < this.actions.length;
      }
    },
    methods: {
      loadMore() {
        const remainingActions = this.actions.slice(this.loadedCount, this.loadedCount + this.limit);
        this.loadedCount += remainingActions.length;
        if (this.loadedCount >= this.actions.length) {
          this.allLoaded = true;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any custom styling here */
  </style>
  