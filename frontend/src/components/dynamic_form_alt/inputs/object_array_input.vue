<template>
  <div class="form-group">
    <label>{{ title }}</label>
    <div v-for="(item, index) in value" :key="index">
      <div>
        <div v-for="field in fields" :key="field.name">
          <component
            :is="getComponent(field.type)"
            :name="`${name}.${index}.${field.name}`"
            :title="field.title"
            :value="item[field.name]"
            :initialData="getInitialData(index, field.name)"
            @update:value="updateValue(index, field.name, $event)"
            v-bind="getAdditionalProps(field)"
          />
          <!-- Handle nested object -->
          <ObjectInput
            v-if="field.type === 'object'"
            :name="`${name}.${index}.${field.name}`"
            :title="field.title"
            :value="item[field.name]"
            :initialData="getInitialData(index, field.name)"
            @update:value="updateValue(index, field.name, $event)"
            :fields="field.fields"
          />
          <!-- Handle nested object array -->
          <ObjectArrayInput 
          class="segment"
            v-if="field.type === 'objects'"
            :name="`${name}.${index}.${field.name}`"
            :title="field.title"
            :value="item[field.name]"
            :initialData="getInitialData(index, field.name)"
            @update:value="updateValue(index, field.name, $event)"
            :fields="field.fields"
            :NoControls="true"
          />
        </div>
        <button v-if="!NoControls" type="button" class="btn btn-danger" @click="removeItem(index)">Remove</button>
      </div>
    </div>
    <button v-if="!NoControls" type="button" class="btn btn-primary" @click="addItem">Add {{ title }}</button>
  </div>
</template>

<script>
import TextInput from './text_input.vue'
import NumberInput from './number_input.vue'
import RangeInput from './range_input.vue'
import FileInput from './file_input.vue'
import TagsInput from './tags_input.vue'
import CheckboxInput from './checkbox_input.vue'
import RadioInput from './radio_input.vue'
import TextareaInput from './text_area_input.vue'
import ColorInput from './color_input.vue'
import TimeInput from './time_input.vue'
import SelectInput from './select_input.vue'

export default {
  name: 'ObjectArrayInput',
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
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    NoControls: {
      type: Boolean,
      required: false
    },
    initialData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    updateValue(index, fieldName, value) {
      const newValue = [...this.value];
      newValue[index] = { ...newValue[index], [fieldName]: value };
      this.$emit('update:value', newValue);
    },
    addItem() {
      const newItem = {};
      this.fields.forEach(field => {
        newItem[field.name] = this.getDefaultValue(field.type);
      });
      const newValue = [...this.value, newItem];
      this.$emit('update:value', newValue);
    },
    removeItem(index) {
      const newValue = [...this.value];
      newValue.splice(index, 1);
      this.$emit('update:value', newValue);
    },
    getInitialData(index, fieldName) {
      return (
        (this.initialData.length > index &&
          this.initialData[index] &&
          this.initialData[index][fieldName]) ||
        this.getDefaultValue(this.fields.find(field => field.name === fieldName)?.type)
      );
    },
    getDefaultValue(type) {
      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'textarea':
        case 'color':
        case 'time':
        case 'date':
        case 'ref':
        case 'radio':
        case 'select':
          return '';
        case 'number':
          return 0;
        case 'checkbox':
          return false;
        case 'tags':
          return [];
        case 'object':
          return {};
        case 'objects':
          return []; 
        default:
          return '';
      }
    },
    getComponent(type) {
      const componentsMap = {
        text: 'TextInput',
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
        objects: 'ObjectArrayInput' // Use ObjectArrayInput for nested object arrays
      };
      return componentsMap[type] || 'TextInput'; // Fallback to TextInput if type is unknown
    },
    getAdditionalProps(field) {
      const additionalProps = {};
      if (field.type === 'range') {
        additionalProps.min = field.min;
        additionalProps.max = field.max;
      }
      if (field.type === 'file') {
        additionalProps.accept = field.accept;
      }
      if (field.type === 'radio' || field.type === 'select') {
        additionalProps.options = field.options;
      }
      if (field.type === 'textarea') {
        additionalProps.rows = field.rows;
      }
      if (field.required !== undefined) {
        additionalProps.required = field.required;
      }
      return additionalProps;
    }
  }
};
</script>

<style scoped>
.segment{
  border: 5px solid greenyellow;
}
.form-group {
  margin-bottom: 1rem;
}
.btn {
  margin-top: 1rem;
}
</style>
