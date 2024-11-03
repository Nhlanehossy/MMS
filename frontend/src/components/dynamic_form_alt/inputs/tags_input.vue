<template>
  <div class="form-group">
    <label :for="name">{{ title }}</label>
    <div class="tags-input">
      <div class="tags">
        <a-tag
          v-for="(tag, index) in value"
          :key="index"
          closable
          @close="removeTag(index)"
        >
          {{ tag }}
        </a-tag>
      </div>
      <a-input
        class="modern-input"
        :id="name"
        :name="name"
        v-model="newTag"
        @pressEnter="addTag"
        placeholder="Add a tag..."
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagsInput',
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
    initialData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      newTag: ''
    };
  },
  created() {
    if (this.initialData.length) {
      this.$emit('update:value', this.initialData);
    }
  },
  methods: {
    addTag() {
      if (this.newTag.trim() !== '') {
        const newTags = [...this.value, this.newTag.trim()];
        this.$emit('update:value', newTags);
        this.newTag = '';
      }
    },
    removeTag(index) {
      const newTags = [...this.value];
      newTags.splice(index, 1);
      this.$emit('update:value', newTags);
    }
  }
};
</script>

<style scoped>
.tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
}

.modern-input {
  width: auto;
  flex-grow: 1;
  margin-top: 5px;
}
</style>
