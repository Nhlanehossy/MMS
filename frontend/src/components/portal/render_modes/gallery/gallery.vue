<template>
  <div class="my-52">
      <IdDataFetcher :resource="'image-galleries'" :resourceId="id">
        <template #default="{ data, error }">
          <div v-if="error">
            <p>Error: {{ error.message }}</p>
          </div>
          <div v-else>
            <span v-if="data">
                
                <Atomicgallery :images="data.images"/>
      
            </span>
          </div>
        </template>
      </IdDataFetcher>
  </div>
</template>

<script>
import Atomicgallery from "../gallery/atomic_gallery.vue";
import IdDataFetcher from "../../../IdDataFetcher.vue";

export default {
  components: {
    IdDataFetcher,
    Atomicgallery
  },
  data() {
    return {
        id: this.$route.params.id
    };
  },
};
</script>
