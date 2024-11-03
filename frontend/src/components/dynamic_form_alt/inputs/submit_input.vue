<template>
  <div class="form-group">
        <button v-if="required" type="submit">
            {{ name }}
        </button>
  </div>
</template>

<script>
export default {
  name: 'SubmitInput',
  props: {
    name: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>
