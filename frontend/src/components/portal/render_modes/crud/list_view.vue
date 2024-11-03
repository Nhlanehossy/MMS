<template>
  <ImagePreview ref="imagePreview" />
  <div class="">
    <ul class="space-y-4">
      <li v-for="(item, index) in items" :key="index"
        class="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md">
        <!-- Flex container for checkbox, item number, and action dropdown -->
        <div class="flex items-center justify-between mb-2 p-2 rounded bg-gray-100 border">
          <div class="flex items-center space-x-4">
            <!-- Checkbox and item number in a row -->
            <input type="checkbox" :checked="selectedRows.includes(item.id)"
              @change="toggleRowSelection(item.id, $event.target.checked)"
              class="form-checkbox h-5 w-5 text-secondary rounded" />
            <span class="text-sm font-semibold text-gray-600">#{{ index + 1 }}</span>
          </div>

          <!-- Dropdown for Actions with Ellipsis Icon (with mobile-friendly trigger) -->
          <action_dispatcher :resource="resource" :item="item" />
        </div>

        <!-- Grid for displaying fields -->
        <dl class="grid grid-cols-1 md:flex gap-x-4 gap-y-2 mt-4">
          <template v-for="field in filteredSchema.slice(0, 8)" :key="field.name">
            <div class="py-2 px-2">
              <dt class="text-sm font-medium text-gray-500">{{ field.title }}</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <!-- Gracefully handle object fields -->
                <div v-if="field.type === 'object' && item[field.name]">
                  {{ item[field.name][field.displayField] || 'N/A' }}
                </div>

                <!-- Gracefully handle ref type fields -->
                <div v-else-if="field.type === 'ref' && item[field.name]">
                  <div v-if="field.isStatus">
                    <Loader v-if="loading" />
                    <a :href="`/dashboard/${item[field.resource]}/${item.id}/view`" v-else :class="{
                      'status-badge rounded-sm px-2 py-1 text-xs': true,
                      'bg-green-200 text-green-800 border border-green-400':
                        item[field.name] === 'Complete' ||
                        item[field.name] === 'Available',
                      'bg-yellow-200 text-yellow-800 border border-yellow-400':
                        item[field.name] === 'Pending' ||
                        item[field.name] === 'Checked Out',
                      'bg-red-200 text-red-800 border border-red-400':
                        item[field.name] === 'Cancelled' ||
                        item[field.name] === 'Unavailable',
                      'bg-blue-200 text-blue-800 border border-blue-400':
                        item[field.name] === 'In Progress' ||
                        item[field.name] === 'Checked In',
                      'bg-teal-200 text-teal-800 border border-teal-400':
                        item[field.name] === 'Active' ||
                        item[field.name] === 'Retired' ||
                        item[field.name] === 'Approved',
                      'bg-red-700 text-white border border-red-800':
                        item[field.name] === 'Inactive' ||
                        item[field.name] === 'Terminated' ||
                        item[field.name] === 'Resigned' ||
                        item[field.name] === 'Suspended',
                    }">
                      {{ item[field.name] }}
                    </a>
                  </div>
                  <a :href="`/dashboard/${item[field.resource]}/${item.id}/view`" v-else>{{ item[field.name]
                    }}</a>
                </div>

                <!-- Handle boolean check fields -->
                <div v-else-if="field.type === 'check'">
                  <i v-if="item[field.name]" class="fas fa-check text-green-500"></i>
                  <i v-else class="fas fa-times text-red-500"></i>
                </div>

                <!-- Handle tags with safe checks -->
                <div v-else-if="field.type === 'tags' && Array.isArray(item[field.name])">
                  <Loader v-if="tagLoading" />
                  <div v-else class="flex flex-wrap gap-2">
                    <span v-for="(tag, tagIndex) in item[field.name]" :key="tagIndex"
                      class="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Image field handling -->
                <div v-else-if="field.type === 'image' && item[field.name]">
                  <img :src="item[field.name]" class="w-16 h-16 object-cover rounded" alt="Image"
                    @mouseover="$refs.imagePreview.openPreview(item[field.name])"
                    @mouseleave="$refs.imagePreview.closePreview()" />
                </div>

                <!-- Image array handling -->
                <div v-else-if="field.type === 'image array' && Array.isArray(item[field.name])" class="flex space-x-2">
                  <img v-for="(image, imgIndex) in item[field.name]" :key="imgIndex" :src="image"
                    class="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm" alt="Image" />
                </div>

                <!-- Date field handling -->
                <div v-else-if="field.type === 'date' && item[field.name]">
                  {{ formatDate(item[field.name]) }}
                </div>

                <!-- Richtext field handling -->
                <div v-else-if="field.type === 'richtext' && item[field.name]"
                  v-html="truncateText(item[field.name], 100)"></div>

                <!-- Default text truncation for other fields -->
                <div v-else>
                  {{ truncateText(item[field.name], 100) || 'N/A' }}
                </div>
              </dd>
            </div>
          </template>
        </dl>
      </li>
    </ul>

    <div v-if="items.length === 0" class="text-center py-8 text-gray-500">
      No records to display.
    </div>
  </div>
</template>

<script>
import refOptionsService from "../../../../executables/refOptionsService";
import Loader from "../../../u_i/sf_loader.vue";
import ImagePreview from "./image_preview.vue";
import action_dispatcher from "../../../action_dispatcher.vue";

export default {
  components: { Loader, ImagePreview, action_dispatcher },
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
  data() {
    return {
      selectedAction: new Array(this.items.length).fill(""),
      refOptions: [],
      loading: false,
      tagLoading: false,
      resolvedTagLabels: {},
    };
  },

  created() {
    this.fetchRefOptions();
    this.initializeTagLabels();
  },
  computed: {
    filteredSchema() {
      return this.resource.schema.filter((field) => field.type !== "password");
    },
  },
  methods: {
    async getTagLabel(tagId, resource, fieldName) {
      try {
        const options = await refOptionsService.getRefOptions(resource, fieldName);
        const option = options.find((opt) => opt.id == tagId);
        return option ? option.name : "";
      } catch (error) {
        console.error(error);
        return "";
      }
    },
    formatDate(date) {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
    async initializeTagLabels() {
      this.tagLoading = true;
      try {
        for (const field of this.resource.schema) {
          if (field.type === "tags" && field.tagInputType === "refs") {
            this.resolvedTagLabels[field.name] = {};
            for (const item of this.items) {
              for (const tagId of item[field.name]) {
                if (!this.resolvedTagLabels[field.name][tagId]) {
                  this.resolvedTagLabels[field.name][tagId] =
                    await this.getTagLabel(tagId, field.resource, field.field);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.tagLoading = false;
      }
    },
    async fetchRefOptions() {
      this.refOptions = {};
      for (const field of this.resource.schema) {
        if (field.type === "ref") {
          this.refOptions[field.name] = await refOptionsService.getRefOptions(field.resource, field.field);
        }
      }
    },
    toggleRowSelection(id, checked) {
      const updatedRows = checked ? [...this.selectedRows, id] : this.selectedRows.filter((rowId) => rowId !== id);
      this.$emit("update:selectedRows", updatedRows);
    },
    truncateText(text, maxLength = 100) {
      if (!text) return "";
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },
  },
};
</script>
