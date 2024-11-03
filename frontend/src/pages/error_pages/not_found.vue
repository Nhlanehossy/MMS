<template>
    <div class="error-page">
      <a-result
        status="404"
        title="404"
        sub-title="Sorry, the page you visited does not exist."
      >
        <template #extra>
          <button class="border border-primary text-primary py-1 hover:cursor-pointer hover:-translate-y-0.5 transition px-4 rounded-md" @click="goHome">Back to Home</button>
        </template>
      </a-result>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'NotFound',
    setup() {
      const router = useRouter();
  
      const goHome = () => {
        router.push('/');
      };
  
      return { goHome };
    }
  });
  </script>
  
  <style scoped>
  .error-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--background);
  }
  </style>
  