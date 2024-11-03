<template>
  <div class="password-field">
    <a-typography-text>
      <template v-if="value">
        <span>{{ maskedPassword }}</span>
      </template>
      <template v-else>
        <span>No password set</span>
      </template>
    </a-typography-text>
  </div>
</template>

<script>
import { Typography } from 'ant-design-vue';
import { computed } from 'vue';

export default {
  name: 'PasswordField',
  components: {
    ATypographyText: Typography.Text,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const maskedPassword = computed(() => {
      if (!props.value) return '';
      return '•'.repeat(props.value.length);
    });

    return {
      maskedPassword,
    };
  },
};
</script>

<style scoped>
.password-field {
  width: 100%;
}
</style>