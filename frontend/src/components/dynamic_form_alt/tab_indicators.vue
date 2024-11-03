<template>
  <div class="tab-indicators">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      @click="changeTab(index)"
      :class="['tab-button', { 'active': currentTab === index }]"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'TabIndicators',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    currentTab: {
      type: Number,
      required: true
    }
  },
  methods: {
    changeTab(index) {
      this.$emit('changeTab', index);
    }
  }
}
</script>

<style scoped>
.tab-indicators {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-button.active {
  background-color: #007bff;
  color: white;
}

.tab-button:hover {
  background-color: #e0e0e0;
}

.tab-button.active:hover {
  background-color: #0056b3;
}
</style>