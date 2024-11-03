<template>
  <div class="step-indicators-container">

    <div class="current-step-name">{{ steps[currentStep].name }}</div>
    <transition name="fade">
      <img
        v-if="steps[currentStep].image"
        :src="steps[currentStep].image"
        :alt="steps[currentStep].name"
        class="current-step-image"
      />
    </transition>
    <div class="current-step-info">
      <div v-if="steps[currentStep].description" class="current-step-description">
        {{ steps[currentStep].description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(step => 
          typeof step.name === 'string' &&
          (!step.description || typeof step.description === 'string') &&
          (!step.image || typeof step.image === 'string')
        );
      }
    },
    currentStep: Number,
    mode: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'multistep', 'tabbed'].includes(value)
    }
  },
  methods: {
    goToStep(index) {
      if (index < this.currentStep) {
        this.$emit('goToStep', index);
      }
    },
  },
};
</script>

<style scoped>
.step-indicators-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  margin-bottom: 1rem;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.current-step-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary);
  text-align: center;
}

.current-step-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.current-step-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.current-step-image {
  margin-top: 1rem;
  max-width: 30%;
  height: auto;
  border-radius: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
