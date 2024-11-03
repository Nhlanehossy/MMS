<template>
  <a-modal v-model:open="open" :title="title" @ok="handleOk">
    <template #default>
      <slot />
    </template>
    <template #footer>
      <a-button key="back" @click="handleCancel">Return</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      open: false,
    };
  },
  methods: {
    showModal() {
      this.open = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.open = false;
        this.$emit('ok');
      }, 2000);
    },
    handleCancel() {
      this.open = false;
      this.$emit('cancel');
    },
  },
};
</script>