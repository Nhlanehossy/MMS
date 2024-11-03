<template>
  <div class="field-display">
    <component 
      :is="getFieldComponent(field.type || fallbackType)" 
      v-if="field.type || fallbackType" 
      :field="field" 
      :value="value"
      :isAvatar="field.isAvatar"
    />
  </div>
</template>

<script>
import TextField from './fields/textfield.vue';
import IconField from './fields/fonticonfield.vue';
import RichTextField from './fields/richtextfield.vue';
import ImageField from './fields/imagefield.vue';
import TagsField from './fields/tagsfield.vue';
import ImageArrayField from './fields/imagearrayfeild.vue';
import ObjectArrayField from './fields/objectarrayfield.vue';
import ObjectField from './fields/objectfeild.vue';
import RefField from './fields/refField.vue';
import EmailField from './fields/emailField.vue';
import PhoneField from './fields/phonefield.vue';
import DateField from './fields/dateField.vue';
import CheckField from './fields/checkfield.vue';
import PasswordField from './fields/password.vue';
import action_dispatcher from '../action_dispatcher.vue';
import price_field from './fields/price_field.vue';

export default {
  name: 'DynamicFieldRenderer',
  components: {
    TextField,
    IconField,
    RichTextField,
    ImageField,
    TagsField,
    ImageArrayField,
    ObjectArrayField,
    ObjectField,
    RefField,
    EmailField,
    PhoneField,
    DateField,
    CheckField,
    PasswordField,
    action_dispatcher,
    price_field
  },
  props: {
    field: {
      type: Object,
      default: () => ({}),
    },
    value: {
      required: true,
    },
    fallbackType: {
      type: String,
      default: 'text',
    },
  },
  methods: {
    getFieldComponent(fieldType) {
      const fieldComponents = {
        number: 'TextField',
        text: 'TextField',
        status:'TextField',
        icon: 'IconField',
        richtext: 'RichTextField',
        image: 'ImageField',
        tags: 'TagsField',
        'image array': 'ImageArrayField',
        'object array': 'ObjectArrayField',
        object: 'ObjectField',
        ref: 'RefField',
        email: 'EmailField',
        phone: 'PhoneField',
        date: 'DateField',
        check: 'CheckField',
        password: 'PasswordField',
        action: 'action_dispatcher',
        price:'TextField'
      };
      return fieldComponents[fieldType] || null;
    },
  },
};
</script>

<style scoped>
.field-display {
  width: 100%;
  height: 100%;
}
</style>
