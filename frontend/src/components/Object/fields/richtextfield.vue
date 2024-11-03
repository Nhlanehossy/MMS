<template>
  <div class="rich-text-field-display">
    <div v-html="truncatedValue"></div>
  </div>
</template>

<script>
export default {
  name: 'RichTextField',
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: false, // Changed to false to allow undefined values
    },
  },
  data() {
    return {
      maxLength: 50,
      showFullText: false,
    };
  },
  computed: {
    truncatedValue() {
      const safeValue = this.value || ''; // Handle undefined value
      if (this.showFullText || safeValue.length <= this.maxLength) {
        return safeValue;
      }
      return safeValue.slice(0, this.maxLength) + '...';
    },
    isTextTruncated() {
      return (this.value || '').length > this.maxLength; // Handle undefined value
    },
    seeMoreText() {
      return this.showFullText ? 'See less' : 'See more';
    },
  },
  methods: {
    toggleFullText() {
      this.showFullText = !this.showFullText;
    },
  },
};
</script>

<style scoped>
.see-more {
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
}

.rich-text-field-display {
  overflow: auto;
}
</style>