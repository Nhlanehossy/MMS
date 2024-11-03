<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
    <div v-for="(item, index) in items" :key="index" class="w-[330px]">
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <a-checkbox :checked="selectedRows.includes(item.id)"
              @change="(e) => toggleRowSelection(item.id, e.target.checked)" class="text-blue-600" />
            <div class="flex items-center space-x-2">

              <action_dispatcher :resource="resource" :item="item" />
            </div>
          </div>

          <div class="space-y-4">
            <template v-for="field in resource.schema.slice(0, 3)" :key="field.name">
              <div v-if="['image', 'image array', 'richtext'].includes(field.type)" class="w-full">
                <template v-if="field.type === 'image'">
                  <a-image :src="item[field.name]" :width="200" :height="200" preview
                    class="w-32 h-32 object-cover rounded-md" />
                </template>

                <template v-if="field.type === 'image array'">
                  <a-carousel arrows>
                    <template #prevArrow>
                      <div class="custom-slick-arrow" style="left: 10px; z-index: 1;">
                        <left-circle-outlined />
                      </div>
                    </template>
                    <template #nextArrow>
                      <div class="custom-slick-arrow" style="right: 10px">
                        <right-circle-outlined />
                      </div>
                    </template>
                    <div v-for="(image, imageIndex) in item[field.name]" :key="imageIndex">
                      <img :src="image" class="w-full h-48 object-cover" />
                    </div>
                  </a-carousel>
                </template>

                <div v-if="field.type === 'richtext'" v-html="truncateText(item[field.name], 100)"
                  class="prose max-w-none" />
              </div>

              <div v-else class="space-y-1">
                <p class="text-sm font-medium text-gray-500">{{ field.title }}:</p>

                <template v-if="field.type === 'object'">
                  <div v-for="subField in field.schema" :key="subField.name" class="ml-2">
                    <p class="text-xs text-gray-400">{{ subField.title }}:</p>
                    <p class="text-sm">{{ truncateText(item[field.name][subField.name]) }}</p>
                  </div>
                </template>

                <p v-else-if="field.type === 'ref'" class="text-sm">
                  {{ getValue(field.name, item[field.name]) }}
                </p>

                <template v-else-if="field.type === 'object array'">
                  <div v-for="(subItem, subIndex) in item[field.name]" :key="subIndex" class="ml-2 mb-2">
                    <template v-for="subField in field.schema" :key="subField.name">
                      <p class="text-xs text-gray-400">{{ subField.title }}:</p>
                      <p class="text-sm">{{ truncateText(subItem[subField.name]) }}</p>
                    </template>
                  </div>
                </template>

                <p v-else class="text-sm">
                  {{ truncateText(item[field.name], 100) }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="items.length === 0" class="col-span-full">
      <a-empty description="No records to display" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { Carousel } from 'ant-design-vue';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import refOptionsService from "../../../../executables/refOptionsService";
import action_dispatcher from '../../../action_dispatcher.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    resource: {
      type: Object,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },
    selectedRows: {
      type: Array,
      required: true,
    },
  },

  components: {
    LeftCircleOutlined,
    RightCircleOutlined,
    Carousel,
    action_dispatcher,
  },
  setup(props, { emit }) {
    const selectedAction = ref(new Array(props.items.length).fill(''));
    const refOptions = ref({});
    const loading = ref(false);
    const router = useRouter();

    const getValue = (resource, id) => {
      const myValue = refOptions.value[resource];
      if (!Array.isArray(myValue)) {
        return null;
      }
      return myValue.find(obj => obj.id === id)?.name ?? null;
    };

    const fetchRefOptions = async () => {
      for (const field of props.resource.schema) {
        if (field.type === 'ref') {
          refOptions.value[field.name] = await refOptionsService.getRefOptions(
            field.resource,
            field.field
          );
        }
      }
    };



    const toggleRowSelection = (id, checked) => {
      const updatedRows = checked
        ? [...props.selectedRows, id]
        : props.selectedRows.filter((rowId) => rowId !== id);
      emit('update:selectedRows', updatedRows);
    };

    const truncateText = (text, maxLength = 100) => {
      if (!text) return '';
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    onMounted(() => {
      fetchRefOptions();
    });

    return {
      selectedAction,
      getValue,
      toggleRowSelection,
      truncateText,
    };
  },
});
</script>
