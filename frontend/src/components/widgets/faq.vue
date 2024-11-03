<template>
  <section  data-aos="zoom-in" class="py-12 bg-cardDark">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">{{ title }}</h2>
      <div class="accordion">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="accordion-item"
        >
          <div
            class="accordion-header cursor-pointer flex justify-between items-center p-4 border-b"
            @click="toggleAccordion(index)"
          >
            <h3 class="font-semibold">{{ faq.question }}</h3>
            <span v-if="activeKeys.includes(index)">−</span>
            <span v-else>+</span>
          </div>
          <div
            v-if="activeKeys.includes(index)"
            class="accordion-body p-4"
          >
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  title: String,
  questions: {
    type: Array,
    required: true,
  }, // This now expects an array of objects with question and answer
});

// Use ref to create the FAQs data structure
const faqs = ref([]);

// Populate faqs when the component is created or updated
const populateFaqs = () => {
  faqs.value = props.questions.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
};

// Initial population of FAQs
populateFaqs();

// Watch for changes in questions prop and update faqs accordingly
watch(() => props.questions, () => {
  populateFaqs();
});

// Keep track of the currently active keys
const activeKeys = ref([]);

// Toggle function to manage the active state of accordion items
const toggleAccordion = (index) => {
  if (activeKeys.value.includes(index)) {
    activeKeys.value = activeKeys.value.filter((key) => key !== index);
  } else {
    activeKeys.value.push(index);
  }
};
</script>

<style scoped>
.accordion {
  border: 1px solid var(--cardDark); /* Light gray border */
  border-radius: 0.5rem; /* Rounded corners */
}

.accordion-item {
  border-top: 1px solid var(--cardDark); /* Border for item separation */
}

.accordion-header {
  background-color: var(--cardLight); /* Light background */
}

.accordion-body {
  background-color: var(--cardDark); /* White background for the answer */
}
</style>
