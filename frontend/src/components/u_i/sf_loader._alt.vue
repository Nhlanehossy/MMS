<template>
  <div class="flex justify-center items-center h-screen">
    <div role="status">
      <sf_loader />
    </div>
  </div>
</template>

<script>
import sf_loader from './sf_loader.vue';
export default {
  components: {
    sf_loader
  }
}
</script>
