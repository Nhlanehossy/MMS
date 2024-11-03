<template>
    <div
      class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
      v-if="previewImageSrc"
      @click.self="closePreview"
    >
      <div class="bg-black bg-opacity-50 absolute inset-0"></div>
      <img :src="previewImageSrc" alt="Preview" class="preview-image z-50" />
    </div>
  </template>
  
  <script>
import Loader from '../../../u_i/sf_loader.vue';
  export default {
    data() {
      return {
        components: {
          Loader,
        },
        previewImageSrc: null,
      };
    },
    methods: {
      openPreview(src) {
        this.previewImageSrc = src;
      },
      closePreview() {
        this.previewImageSrc = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .preview-image {
    max-width: 90vw; /* Adjust as needed */
    max-height: 90vh; /* Adjust as needed */
    width: auto;
    height: auto;
    margin: auto;
    display: block;
  }  </style>

  