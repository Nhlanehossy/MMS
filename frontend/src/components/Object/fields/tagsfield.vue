<template>
  <div class="tags-field-display">
    <a-spin :spinning="loading">
      <a-tag v-for="tag in displayTags" :key="tag" color="blue" class="mr-2 mb-2">
        {{ tag }}
      </a-tag>
    </a-spin>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Tag, Spin } from 'ant-design-vue';
import refOptionsService from "@/executables/refOptionsService";

export default {
  name: 'TagsField',
  components: {
    ATag: Tag,
    ASpin: Spin,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true);
    const displayTags = ref([]);

    const fetchTagLabels = async () => {
      if (props.field.tagInputType === 'refs') {
        try {
          const options = await refOptionsService.getRefOptions(
            props.field.resource,
            props.field.field
          );
          displayTags.value = props.value.map(tagId => {
            const option = options.find(opt => opt.id == tagId);
            return option ? option.name : 'Unknown';
          });
        } catch (error) {
          console.error('Error fetching tag labels:', error);
          displayTags.value = props.value.map(() => 'Error loading');
        }
      } else {
        displayTags.value = props.value;
      }
      loading.value = false;
    };

    onMounted(() => {
      fetchTagLabels();
    });

    return {
      loading,
      displayTags,
    };
  },
}
</script>

<style scoped>
.tags-field-display {
  width: 100%;
}
</style>