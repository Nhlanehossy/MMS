<!-- Pagination.vue -->
<template>
    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="$emit('prev-page')"
        class="pagination-item"
      >
        {{ translationKeys.Previous }}
      </button>
      <span class="text-text font-bold">{{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="$emit('next-page')"
        class="pagination-item"
      >
        {{ translationKeys.Next }}
      </button>
    </div>
  </template>
  
  <script>
  import { translationKeys } from '@/executables/translation';
  export default {
    data() {
      return {
        translationKeys: translationKeys
      };
    },
    props: {
      currentPage: {
        type: Number,
        required: true,
      },
      totalPages: {
        type: Number,
        required: true,
      },
    },
  };
  </script>