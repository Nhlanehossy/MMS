<template>
    <div class="flex justify-center items-center h-screen">
      <div role="status">
        <sf_loader />
        <sf_logo />     
      </div>
    </div>
</template>

<script>
import sf_loader from './sf_loader.vue';
import sf_logo from './sf_logo.vue';
export default {
  components: {
    sf_loader,
    sf_logo
  }
}
</script>