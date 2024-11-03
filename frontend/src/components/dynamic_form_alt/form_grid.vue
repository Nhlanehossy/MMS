<template>
  <div class="form-grid">
    <div v-for="field in currentFields" :key="field.name" class="form-group">
      <component :is="getComponentForField(field)" v-bind="field" :title="field.title" :value="formData[field.name]"
        :field="field" @update:value="updateFormData(field.name, $event)" @blur="validateField(field.name)" />
      <span v-if="validationErrors[field.name]" class="error-message">
        {{ validationErrors[field.name] }}&nbsp;<i class="fa-solid fa-circle-exclamation"></i>
      </span>
    </div>
  </div>
</template>

<script>
import TextInput from './inputs/text_input.vue'
import NumberInput from './inputs/number_input.vue'
import RangeInput from './inputs/range_input.vue'
import FileInput from './inputs/file_input.vue'
import ObjectInput from './inputs/object_input.vue'
import ObjectArrayInput from './inputs/object_array_input.vue'
import TagsInput from './inputs/tags_input.vue'
import CheckboxInput from './inputs/checkbox_input.vue'
import RadioInput from './inputs/radio_input.vue'
import TextareaInput from './inputs/text_area_input.vue'
import ColorInput from './inputs/color_input.vue'
import TimeInput from './inputs/time_input.vue'
import SelectInput from './inputs/select_input.vue'
import RefSelectInput from './inputs/ref_input.vue'
import DateTimeInput from './inputs/date_time_input.vue'
import PasswordInput from './inputs/password_input.vue'
import TelephoneInput from './inputs/vue_tel_input.vue'
import icon_input from './inputs/icon_input.vue'
import price_input from './inputs/price_input.vue'

export default {
  name: 'DynamicForm',
  components: {
    TextInput,
    NumberInput,
    RangeInput,
    FileInput,
    ObjectInput,
    ObjectArrayInput,
    TagsInput,
    CheckboxInput,
    RadioInput,
    TextareaInput,
    ColorInput,
    TimeInput,
    SelectInput,
    RefSelectInput,
    DateTimeInput,
    PasswordInput,
    TelephoneInput,
    icon_input,
    price_input
  },
  props: {
    currentFields: Array,
    formData: Object,
    validationErrors: Object,
    initialData: Object,
    schema: Array
  },
  methods: {
    getComponentForField(field) {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
          return 'TextInput'
        case 'number':
          return 'NumberInput'
        case 'range':
          return 'RangeInput'
        case 'file':
        case 'image':
        case 'video':
        case 'audio':
        case 'document':
        case 'image array':
        case 'video array':
        case 'audio array':
        case 'document array':
          return 'FileInput'
        case 'object':
          return 'ObjectInput'
        case 'objects':
          return 'ObjectArrayInput'
        case 'tags':
          return 'TagsInput'
        case 'checkbox':
        case 'check':
          return 'CheckboxInput'
        case 'radio':
          return 'RadioInput'
        case 'textarea':
        case 'richtext':
          return 'TextareaInput'
        case 'color':
          return 'ColorInput'
        case 'time':
          return 'TimeInput'
        case 'select':
        case 'status':
          return 'SelectInput'
        case 'ref':
          return 'RefSelectInput'
        case 'password':
          return 'PasswordInput'
        case 'icon':
          return 'icon_input'
        case 'datetime':
        case 'date':
        case 'time':
          return 'DateTimeInput'
        default:
          return 'TextInput'
      }
    },
    updateFormData(name, value) {
      this.$emit('update:formData', { name, value });
    },
    validateField(name) {
      this.$emit('validateField', name)
    }
  },
  emits: ['update:formData', 'validateField', 'password-valid']
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
}

.form-group {
  width: 100%;
}

.error-message {
  color: red;
  font-size: 0.875rem;
}
</style>
