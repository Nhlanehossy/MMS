<template>
  <ImagePreview ref="imagePreview" />
  <div class="overflow-x-scroll">

    <div class="hidden md:block">
      <table class="w-full">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left">
              <div class="w-16 text-center">#</div>
            </th>
            <th class="px-4 py-3 text-left" v-for="field in filteredSchema" :key="field.name">
              {{ field.title }}
            </th>
            <th class="px-4 py-3 text-left" v-if="resource.actions">{{ translationKeys.Actions }}</th>
          </tr>
        </thead>
        <tbody v-if="items.length > 0" class="min-h-[20vh]">
  <tr v-for="(item, index) in items" :key="index">
    <!-- Index Column -->
    <td class="px-4 py-3 text-center">
      <div class="w-16">{{ index + 1 }}</div>
    </td>

    <!-- Dynamic Fields -->
    <td v-for="field in filteredSchema" 
        :key="field.name" 
        class="px-4 py-3">
      
      <!-- Object Type -->
      <template v-if="field.type === 'object'">
        {{ item[field.name][field.displayField] }}
      </template>

      <!-- Reference/Status Type -->
      <template v-else-if="field.type === 'ref'">
        <status-indicator 
          v-if="field.isStatus" 
          :status="item[field.name]" 
          :loading="loading"
        />
        <div v-else>{{ item[field.name] }}</div>
      </template>

      <!-- Tags Type -->
      <template v-else-if="field.type === 'tags'">
        <Loader v-if="tagLoading" />
        <div v-else class="flex flex-wrap gap-2">
          <span v-for="(tag, tagIndex) in item[field.name]" 
                :key="tagIndex"
                class="px-3 py-1 rounded-full bg-gray-100">
            {{ tag }}
          </span>
        </div>
      </template>

      <!-- Image Type -->
      <template v-else-if="field.type === 'image'">
        <img :src="item[field.name]"
             class="w-14 h-14 object-cover rounded-lg cursor-pointer"
             alt="Preview"
             @mouseover="$refs.imagePreview.openPreview(item[field.name])"
             @mouseleave="$refs.imagePreview.closePreview()" />
      </template>

      <!-- Image Array Type -->
      <template v-else-if="field.type === 'image array'">
        <div class="flex -space-x-4">
          <img v-for="(image, imgIndex) in item[field.name]"
               :key="imgIndex"
               :src="image"
               class="w-10 h-10 object-cover rounded-full border-2 border-white"
               alt="Image" />
        </div>
      </template>

      <!-- Object Array Type -->
      <template v-else-if="field.type === 'object array'">
        <div v-for="(subItem, subIndex) in item[field.name]" 
             :key="subIndex"
             class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
          <div v-for="subField in field.schema" 
               :key="subField.name"
               class="text-sm">
            {{ truncateText(subItem[subField.name]) }}
          </div>
        </div>
      </template>

      <!-- Check Type -->
      <template v-else-if="field.type === 'check'">
        <div class="text-center">
          <i v-if="item[field.name]" 
             class="fa fa-check text-green-500"></i>
          <i v-else 
             class="fa fa-ban text-red-500"></i>
        </div>
      </template>

      <!-- Icon Type -->
      <template v-else-if="field.type === 'icon'">
        <i v-if="item[field.name]" :class="item[field.name]"></i>
      </template>

      <!-- Video Type -->
      <template v-else-if="field.type === 'video'">
        <video :src="item[field.name]"
               class="w-full max-w-[200px] rounded"
               controls>
          Your browser does not support video playback.
        </video>
      </template>

      <!-- Rich Text Type -->
      <template v-else-if="field.type === 'richtext'">
        <div v-html="item[field.name] ? truncateText(item[field.name], 30) : ''"
             class="prose prose-sm max-w-none"></div>
      </template>

      <!-- Default Text Type -->
      <template v-else>
        <div class="truncate max-w-xs">
          {{ truncateText(item[field.name], 14) }}
        </div>
      </template>
    </td>

    <!-- Actions Column -->
    <td v-if="resource.actions" class="px-4 py-3">
      <div class="flex items-center space-x-2">
        <action_dispatcher 
          :resource="resource" 
          :item="item" 
          orientation="icons" />
      </div>
    </td>
  </tr>
</tbody>

        <tfoot v-else>
          <tr>
            <td colspan="100%" class="px-4 py-3 text-center">
              <a-empty description="No records to display" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Mobile view -->
    <div class="md:hidden">
      <div v-if="items.length > 0" class="space-y-4">
        <div v-for="(item, index) in items" :key="index" class="p-4 card">
          <div class="flex items-center justify-between mb-2">
            <div>#{{ index + 1 }}</div>
            <input type="checkbox" :checked="selectedRows.includes(item.id)"
              @change="toggleRowSelection(item.id, $event.target.checked)" class="h-5 w-5" />
          </div>
          <div v-for="field in resource.schema" :key="field.name" class="flex justify-between items-center">
            <span>{{ field.title }}</span>
            <span class="text-right">
              <!-- Field value rendering logic -->
              <template v-if="field.type === 'object'">
                {{ item[field.name][field.displayField] }}
              </template>

              <template v-else-if="field.type === 'ref'">
                <div v-if="field.isStatus">
                  <Loader v-if="loading" />
                  <span v-else>
                    <span class="px-2 py-1">
                      {{ item[field.name] }}
                    </span>
                  </span>
                </div>
                <div v-else>
                  {{ item[field.name] }}
                </div>
              </template>

              <template v-else-if="field.type === 'password'">
                <p>*****</p>
              </template>

              <template v-else-if="field.type === 'check'">
                <i v-if="item[field.name]" class="fa fa-check"></i>
                <i v-else class="fa fa-ban"></i>
              </template>

              <template v-else-if="field.type === 'tags'">
                <Loader v-if="tagLoading" />
                <div v-else class="flex flex-wrap gap-1 justify-end">
                  <span v-for="(tag, tagIndex) in item[field.name]" :key="tagIndex" class="px-2 py-1">
                    {{ resolvedTagLabels[field.name][tag] || tag }}
                  </span>
                </div>
              </template>

              
              <template v-else-if="field.type === 'object array'">
                <div v-for="(subItem, subIndex) in item[field.name]" :key="subIndex">
                  <div v-for="subField in field.schema" :key="subField.name">
                    {{ truncateText(subItem[subField.name]) }}
                  </div>
                </div>
              </template>

              <template v-else-if="field.type === 'image'">
                <img :src="item[field.name]" class="w-12 h-12 object-cover" alt="Image"
                  @mouseover="$refs.imagePreview.openPreview(item[field.name])"
                  @mouseleave="$refs.imagePreview.closePreview()" />
              </template>

              <div v-else-if="field.type === 'image array'" class="flex">
                <div class="flex space-x-[-35px]">
                  <template v-for="(image, index) in item[field.name]">
                    <img :src="image" class="w-10 h-10 object-cover -translate-y-2" alt="Image">
                  </template>
                </div>
              </div>

              <template v-else-if="field.type === 'date'">
                {{ formatDate(item[field.name]) }}
              </template>

              <template v-else-if="field.type === 'video'">
                <video :src="item[field.name]" width="100" controls>
                  Your browser does not support the video tag.
                </video>
              </template>

              <template v-else-if="field.type === 'richtext'">
                <div v-html="item[field.name] ? truncateText(item[field.name], 30) : ''"></div>
              </template>

              <template v-else>
                {{ truncateText(item[field.name], 14) }}
              </template>
            </span>
          </div>
          <div v-if="resource.actions" class="mt-4">
            <action_dispatcher :resource="resource" :item="item" orientation="buttons" />
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4">
        {{ translationKeys.NoRecordsFound }}
      </div>
    </div>

  </div>
</template>

<script>
import refOptionsService from "../../../../executables/refOptionsService";
import Loader from "../../../u_i/sf_loader.vue";
import ImagePreview from "./image_preview.vue";
import Atomicgallery from "../gallery/atomic_gallery.vue";
import { translationKeys } from '@/executables/translation';
import action_dispatcher from "../../../action_dispatcher.vue";
export default {
  components: { Loader, ImagePreview, Atomicgallery, action_dispatcher },
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
      required: false,
      default: []
    },

  },
  data() {
    return {
      selectedAction: new Array(this.items.length).fill(""),
      refOptions: [],
      loading: false,
      tagLoading: false,
      resolvedTagLabels: {},
      showPreview: false,
      previewImageSrc: null,
      translationKeys: translationKeys,
      tableData: [],
    };
  },

  created() {
    console.log(this.resource)
    this.fetchRefOptions();
    this.initializeTagLabels();
  },
  computed: {
    filteredSchema() {
      return this.resource.schema.filter(field => field.type !== 'password' && field.type !== 'me');
    }
  }
  ,
  methods: {

    async getTableData() {

      if (this.objectFilters) {

        this.tableData = this.items.filter(item[this.objectFilters.field] === this.objectFilters.value)

      } else {
        this.tableData = this.items
      }

    },
    async getTagLabel(tagId, resource, fieldName) {
      try {
        const options = await refOptionsService.getRefOptions(
          resource,
          fieldName
        );
        const option = options.find((opt) => opt.id == tagId);
        return option ? option.name : "";
      } catch (error) {
        console.error(error);
        return "";
      }
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
    //
    getValue(resource, id) {
      const myValue = this.refOptions[resource];

      if (!Array.isArray(myValue)) {
        return null;
      }

      for (const obj of myValue) {
        if (obj.id === id) {
          return obj.name;
        }
      }

      return null;
    },
    async fetchRefOptions() {
      this.refOptions = {};

      for (const field of this.resource.schema) {
        if (field.type === "ref") {
          this.refOptions[field.name] = await refOptionsService.getRefOptions(
            field.resource,
            field.field
          );
        }
      }
    },

    toggleSelectAll(event) {
      this.$emit(
        "update:selectedRows",
        event.target.checked ? this.items.map((item) => item.id) : []
      );
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    toggleRowSelection(id, checked) {
      let updatedRows;
      if (checked) {
        updatedRows = [...this.selectedRows, id];
      } else {
        updatedRows = this.selectedRows.filter(rowId => rowId !== id);
      }
      this.$emit('update:selectedRows', updatedRows);
    },
    truncateText(text, maxLength = 100) {
      if (!text) return "";
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },
  },
};
</script>

<style scoped>
.action-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
}
</style>
