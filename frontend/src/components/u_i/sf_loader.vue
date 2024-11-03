<template>
  <div class="loader-container">
    <div class="blob"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.startLoading();
  },
  beforeUnmount() {
    this.stopLoading();
  },
  methods: {
    startLoading() {
      this.originalTitle = document.title;
      this.loadingInterval = setInterval(() => {
        document.title = 'Loading' + '.'.repeat((Date.now() / 500) % 4);
      }, 500);
    },
    stopLoading() {
      clearInterval(this.loadingInterval);
      document.title = this.originalTitle;
    }
  }
}
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.blob {
  background: rgba(var(--primary), 0.7);
  border-radius: 50%;
  margin: 10px;
  height: 60px;
  width: 60px;
  box-shadow: 0 0 0 0 rgba(var(--primary), 1);
  transform: scale(1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(var(--primary), 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(var(--primary), 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(var(--primary), 0);
  }
}
</style>