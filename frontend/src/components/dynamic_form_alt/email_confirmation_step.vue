<template>
  <div class="email-confirmation-step">
    <img src="https://freewebillustrations.com/static/images/preview/delesign-free-designs-email.png" class="w-72" alt="Email Confirmation">
    <p>Please enter the 6-digit code sent to {{ email }}</p>
    <div class="otp-input-container">
      <input
        v-for="(digit, index) in 6"
        :key="index"
        type="text"
        :ref="`otpInput${index}`"
        v-model="otpDigits[index]"
        @input="onInput(index)"
        @paste="onPaste"
        @keydown="onKeyDown($event, index)"
        maxlength="1"
        class="otp-input"
      />
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    },
    confirmationCode: {
      type: String,
      required: true
    },
    error: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      otpDigits: ['', '', '', '', '', '']
    };
  },
  watch: {
    otpDigits: {
      handler(newValue) {
        this.$emit('update:confirmationCode', newValue.join(''));
      },
      deep: true
    }
  },
  methods: {
    onInput(index) {
      if (this.otpDigits[index].length === 1 && index < 5) {
        this.$refs[`otpInput${index + 1}`][0].focus();
      }
    },
    onKeyDown(event, index) {
      if (event.key === 'Backspace' && index > 0 && this.otpDigits[index] === '') {
        this.$refs[`otpInput${index - 1}`][0].focus();
      }
    },
    onPaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text');
      const digits = pastedData.slice(0, 6).split('');
      digits.forEach((digit, index) => {
        if (index < 6) {
          this.otpDigits[index] = digit;
        }
      });
      if (digits.length > 0) {
        this.$refs[`otpInput${Math.min(5, digits.length - 1)}`][0].focus();
      }
    }
  }
};
</script>

<style scoped>
.email-confirmation-step {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.otp-input-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.otp-input {
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 1.2rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
