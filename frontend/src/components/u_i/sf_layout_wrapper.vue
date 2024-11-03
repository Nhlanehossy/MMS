<template>
  <Container>
    <div class="grid gap-x-4 gap-y-4" :class="gridClasses">
      <slot></slot>
    </div>
  </Container>
</template>

<script>
import Container from './Container.vue';

export default {

  name: 'UILayoutWrapper',
  components:{Container},
  props: {
    columns: {
      type: Number,
      default: 1,
    },
    gap: {
      type: String,
      default: '4',
    },
  },
  computed: {
    gridClasses() {
      const baseClasses = [];

      // Number of columns for different screen sizes
      baseClasses.push(`sm:grid-cols-${this.columns > 1 ? Math.min(this.columns, 2) : 1}`);
      baseClasses.push(`md:grid-cols-${this.columns > 2 ? Math.min(this.columns, 3) : this.columns}`);
      baseClasses.push(`lg:grid-cols-${this.columns > 3 ? Math.min(this.columns, 4) : this.columns}`);
      baseClasses.push(`xl:grid-cols-${this.columns > 4 ? Math.min(this.columns, 6) : this.columns}`);
      baseClasses.push(`2xl:grid-cols-${this.columns}`);

      // Grid gap
      baseClasses.push(`gap-${this.gap}`);

      return baseClasses;
    },
  },
};
</script>