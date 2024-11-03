<template>
  <div class=" w-full">
    <div class="flex justify-between space-x-4">
      <button
        v-if="currentStep > 0"
        @click="prevStep"
        class="flex items-center px-6 py-3 text-sm font-medium text-white bg-gray-500 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
        :disabled="currentStep === 0"
        :class="{ 'opacity-50 cursor-not-allowed': currentStep === 0 }"
      >
        <i class="mr-2">&#8592;</i>
        Previous
      </button>

      <button
        v-if="currentStep < steps.length - 1"
        @click="nextStep"
        class="flex items-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        :disabled="currentStep === steps.length - 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentStep === steps.length - 1 }"
      >
        Next
        <i class="ml-2">&#8594;</i>
      </button>

      <button
        v-if="currentStep === steps.length - 1"
        @click="finish"
        class="flex items-center px-6 py-3 text-sm font-medium text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
      >
        Submit
        <i class="ml-2">&#10003;</i>
      </button>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    steps: Array,
    currentStep: Number,
  },
  methods: {
    prevStep() {
      this.$emit("prevStep");
    },
    nextStep() {
      this.$emit("nextStep");
    },
    finish() {
      this.$emit("finish");
    },
  },
};
</script>


<style scoped>
/* Remove all existing styles */
</style>
