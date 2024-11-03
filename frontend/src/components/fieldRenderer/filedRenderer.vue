<template>
  <component :is="fieldComponent" :field="field" :value="value" />
</template>

<script>
import text from './fields/text.vue';
import richText from './fields/richText.vue';
import number from './fields/number.vue';
import boolean from './fields/boolean.vue';
import date from './fields/date.vue';
import time from './fields/time.vue';
import phone from './fields/phone.vue';
import link from './fields/link.vue';
import image from './fields/image.vue';
import imageArray from './fields/imageArray.vue';
import tags from './fields/tags.vue';
import user from './fields/user.vue';
import userArray from './fields/userArray.vue';
import userTags from './fields/userTags.vue';
import userTagsArray from './fields/userTagsArray.vue';

export default {
  name: 'DynamicFieldRenderer',
  components: {
    text,
    richText,
    number,
    boolean,
    date,
    time,
    phone,
    link,
    image,
    imageArray,
    tags,
    user,
    userArray,
    userTags,
    userTagsArray,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
    },
  },
  computed: {
    fieldComponent() {
      return this.field.type || 'text';
    },
  },
}
</script>