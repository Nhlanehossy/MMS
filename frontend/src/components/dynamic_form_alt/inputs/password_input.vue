<template>
  <div class="mb-4">
    <label :for="name" class="block mb-2 font-bold">{{ title }}</label>
    <div class="relative">
      <a-input
        :id="name"
        :name="name"
        :type="showPassword ? 'text' : 'password'"
        :value="value"
        @input="handleInput"
        class="w-full px-3 py-2 pr-10 rounded-md"
        :class="{ 'border-red-500': errorMessage }"
        suffix-icon
      >
        <template #suffix>
          <i
            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="togglePasswordVisibility"
            class="cursor-pointer"
          ></i>
        </template>
      </a-input>
    </div>
    <div class="mt-2">
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
      <div v-else-if="value" class="mt-2">
        <div class="flex items-center">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-300"
              :class="strengthBarColor"
              :style="{ width: `${(strength / 4) * 100}%` }"
            ></div>
          </div>
          <span class="ml-2 text-sm" :class="strengthTextColor">{{ strengthText }}</span>
        </div>
        <ul class="mt-2 text-sm">
          <li :class="criteriaClass(value.length >= minLength)">
            At least {{ minLength }} characters
          </li>
          <li :class="criteriaClass(hasLowerAndUpperCase)">
            Contains lowercase and uppercase letters
          </li>
          <li :class="criteriaClass(hasNumber)">Contains a number</li>
          <li :class="criteriaClass(hasSpecialChar)">
            Contains a special character
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    minLength: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      showPassword: false,
      errorMessage: '',
      strength: 0
    };
  },
  computed: {
    strengthText() {
      if (this.strength === 0) return 'Very Weak';
      if (this.strength === 1) return 'Weak';
      if (this.strength === 2) return 'Medium';
      if (this.strength === 3) return 'Strong';
      return 'Very Strong';
    },
    strengthBarColor() {
      if (this.strength < 2) return 'bg-red-500';
      if (this.strength < 3) return 'bg-yellow-500';
      if (this.strength < 4) return 'bg-green-500';
      return 'bg-green-600';
    },
    strengthTextColor() {
      if (this.strength < 2) return 'text-red-500';
      if (this.strength < 3) return 'text-yellow-500';
      if (this.strength < 4) return 'text-green-500';
      return 'text-green-600';
    },
    hasLowerAndUpperCase() {
      return /[a-z]/.test(this.value) && /[A-Z]/.test(this.value);
    },
    hasNumber() {
      return /\d/.test(this.value);
    },
    hasSpecialChar() {
      return /[^a-zA-Z0-9]/.test(this.value);
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleInput(event) {
      this.validatePassword();
      this.calculateStrength();
      this.$emit('update:value', event.target.value);
    },
    validatePassword() {
      if (this.value.length < this.minLength) {
        this.errorMessage = `Password must be at least ${this.minLength} characters long`;
      } else {
        this.errorMessage = '';
      }
    },
    calculateStrength() {
      this.strength = 0;
      if (this.value.length >= this.minLength) this.strength++;
      if (this.hasLowerAndUpperCase) this.strength++;
      if (this.hasNumber) this.strength++;
      if (this.hasSpecialChar) this.strength++;
    },
    criteriaClass(isValid) {
      return isValid ? 'text-green-600' : 'text-gray-500';
    }
  }
};
</script>

<style scoped>
/* Custom styles to enhance the appearance of the input field and strength indicator */
.form-group {
  margin-bottom: 1rem;
}
</style>
