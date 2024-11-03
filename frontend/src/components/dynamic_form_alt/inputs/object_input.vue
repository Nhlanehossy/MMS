<template>
  <div class="form-group">
    <label>{{ title }}</label>
    <div v-for="field in fields" :key="field.name">
      <component
        :is="getComponent(field.type)"
        :name="`${name}.${field.name}`"
        :title="field.title"
        :type="field.type"
        :value="value[field.name]"
        :initialData="initialData[field.name]"
        @update:value="updateValue(field.name, $event)"
        v-bind="getAdditionalProps(field)"
      >
        <!-- Recursive ObjectInput handling -->
        <ObjectInput
          v-if="field.type === 'object'"
          :name="`${name}.${field.name}`"
          :title="field.title"
          :value="value[field.name]"
          :fields="field.fields"
          :initialData="initialData[field.name]"
          @update:value="updateValue(field.name, $event)"
        />
        <!-- Handle nested object array -->
        <ObjectArrayInput
          v-if="field.type === 'objects'"
          :name="`${name}.${field.name}`"
          :title="field.title"
          :value="value[field.name]"
          :initialData="initialData[field.name]"
          @update:value="updateValue(field.name, $event)"
          :fields="field.fields"
        />
      </component>
    </div>
  </div>
</template>

<script>
import TextInput from './text_input.vue'
import NumberInput from './number_input.vue'
import RangeInput from './range_input.vue'
import FileInput from './file_input.vue'
import ObjectArrayInput from './object_array_input.vue'
import TagsInput from './tags_input.vue'
import CheckboxInput from './checkbox_input.vue'
import RadioInput from './radio_input.vue'
import TextareaInput from './text_area_input.vue'
import ColorInput from './color_input.vue'
import TimeInput from './time_input.vue'
import SelectInput from './select_input.vue'


export default {
  name: 'ObjectInput',
  components: {
    TextInput,
    NumberInput,
    RangeInput,
    FileInput,
    CheckboxInput,
    RadioInput,
    TextareaInput,
    ColorInput,
    TimeInput,
    SelectInput,
    TagsInput,
    ObjectArrayInput,

  },
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
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    updateValue(fieldName, value) {
      const newValue = { ...this.value }
      newValue[fieldName] = value
      this.$emit('update:value', newValue)
    },
    getComponent(type) {
      const componentsMap = {
        text: 'TextInput',
        date: 'TextInput',
        email: 'TextInput',
        tel: 'TextInput',
        number: 'NumberInput',
        range: 'RangeInput',
        file: 'FileInput',
        checkbox: 'CheckboxInput',
        radio: 'RadioInput',
        textarea: 'TextareaInput',
        color: 'ColorInput',
        time: 'TimeInput',
        select: 'SelectInput',
        tags: 'TagsInput',
        object: 'ObjectInput',
        objects: 'ObjectArrayInput' // Handle nested object arrays
      }
      console.log(`Resolving component for type: ${type}, found: ${componentsMap[type]}`) // Debug log
      return componentsMap[type] || 'TextInput' // Fallback to TextInput if type is unknown
    },
    getAdditionalProps(field) {
      const additionalProps = {}
      if (field.type === 'range') {
        additionalProps.min = field.min
        additionalProps.max = field.max
      }
      if (field.type === 'file') {
        additionalProps.accept = field.accept
      }
      if (field.type === 'radio' || field.type === 'select') {
        additionalProps.options = field.options
      }
      if (field.type === 'textarea') {
        additionalProps.rows = field.rows
      }
      if (field.required !== undefined) {
        additionalProps.required = field.required
      }
      return additionalProps
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
