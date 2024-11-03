<template>
  <div v-if="!resource.tabs" class='w-[95vw] lg:m-0 lg:w-[100%] card rounded-lg px-6 sm:p-8 lg:px-10' >
    <div class="px-6 sm:p-8 lg:px-10">
      <div class="flex items-center justify-between">    
      </div>
      <div id="report">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="field in resource.schema" :key="field.name" :class="{
            'col-span-1': !['image', 'object', 'richtext', 'image array', 'object array'].includes(field.type),
            'sm:col-span-2 lg:col-span-3': ['image', 'object', 'richtext', 'image array', 'object array'].includes(field.type)
          }">
            <div class="p-4">
              <h3 class="mb-2 font-bold">{{ field.title }}</h3>
              <!-- Text, Email, Phone, Number, Decimal -->
              <div v-if="['text', 'email', 'phone', 'number', 'decimal'].includes(field.type)">
                <p>{{ formData[field.name] }}</p>
              </div>
              <!-- Rich Text -->
              <div v-else-if="field.type === 'richtext'" class="prose prose-sm max-w-full">
                <div v-html="formData[field.name]"></div>
              </div>
              <!-- Password -->
              <div v-else-if="field.type === 'password'">
                <p>•••••••••</p>
              </div>
              <!-- Date, DateTime, Time -->
              <div v-else-if="['date', 'datetime', 'time'].includes(field.type)">
                <p>{{ formatDate(formData[field.name]) }}</p>
              </div>
              <!-- Icon -->
              <div v-else-if="field.type === 'icon'">
                <i :class="formData[field.name]"></i>
              </div>
              <!-- Reference or Select -->
              <div v-else-if="field.type === 'ref' || field.type === 'select'">
                <p>
                  {{ field.type === 'ref' ? getValue(field.name, formData[field.name]) : getSelectLabel(field.options,
                    formData[field.name]) }}
                </p>
              </div>
              <!-- Checkbox -->
              <div v-else-if="field.type === 'check'">
                <p>{{ formData[field.name] ? "Yes" : "No" }}</p>
              </div>
              <!-- Image Array -->
              <div v-else-if="field.type === 'image array'" class="w-full">
                <a-carousel :autoplay="true">
                  <a-carousel-item v-for="(image, index) in formData[field.name]" :key="index">
                    <img :src="image" :alt="field.title" class="w-full h-auto object-cover" />
                  </a-carousel-item>
                </a-carousel>
              </div>
              <!-- Radio -->
              <div v-else-if="field.type === 'radio'">
                <p>
                  {{ getRadioLabel(field.options, formData[field.name]) }}
                </p>
              </div>
              <!-- Image, Video, Audio, Document -->
              <div v-else-if="['image', 'video', 'audio', 'document'].includes(field.type)" class="w-full">
                <div v-if="field.type === 'image'" class="mb-4 flex justify-center">
                  <img :src="formData[field.name]" :alt="field.title"
                    class="w-96 h-[42rem] max-h-64 object-fill" />
                </div>
                <div v-else-if="field.type === 'video'" class="mb-4">
                  <video :src="formData[field.name]" class="w-full max-h-64 object-cover" controls>
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div v-else-if="field.type === 'audio'" class="mb-4">
                  <audio :src="formData[field.name]" class="w-full" controls>
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div v-else-if="field.type === 'document'" class="mb-4">
                  <a :href="formData[field.name]" :download="`${field.title}.pdf`"
                    class="inline-flex items-center px-4">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download {{ field.title }}
                  </a>
                </div>
              </div>
              <!-- Color -->
              <div v-else-if="field.type === 'color'" class="flex items-center">
                <div :style="{ backgroundColor: formData[field.name] }"
                  class="w-8 h-8 mr-4"></div>
                <span>{{ formData[field.name] }}</span>
              </div>
              <!-- Range -->
              <div v-else-if="field.type === 'range'">
                <p>{{ formData[field.name] }}</p>
              </div>
              <div v-else-if="field.type === 'status'">
                <p>{{ formData[field.name] }}</p>
              </div>
              <!-- Tags -->
              <div v-else-if="field.type === 'tags'" class="flex flex-wrap">
                <span v-for="(tag, index) in formData[field.name]" :key="index"
                  class="px-3 py-1 mr-2 mb-2">
                  {{ resolvedTagLabels[field.name][tag] || "Loading..." }}
                </span>
              </div>
              <!-- Object -->
              <div v-else-if="field.type === 'object'" class="w-full">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="subField in field.schema" :key="subField.name" class="object-field">
                    <div class="mb-1">{{ subField.title }}</div>
                    <div>
                      {{ formData[field.name][subField.name] }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- Object Array -->
              <div v-else-if="field.type === 'object array'" class="w-full">
                <div v-for="(item, index) in formData[field.name]" :key="index"
                  class=" card ">
                  <div class="flex">
                    <div v-for="subField in field.schema" :key="subField.name">
                      <h4 class="mb-1">
                        {{ subField.title }}
                      </h4>
                      <p v-if="subField.type === 'document'">
                        <a :href="item[subField.name]" :download="`${subField.title}.pdf`">
                          Download {{ subField.title }}
                        </a>
                      </p>
                      <p v-else-if="subField.type !== 'ref'">
                        {{ item[subField.name] }}
                      </p>
                      
















                      <div v-else-if="['image', 'video', 'audio', 'document'].includes(subField.type)" class="w-full">
                <div v-if="subField.type === 'image'" class="mb-4 flex justify-center">
                  <img :src="formData[subField.name]" :alt="subField.title"
                    class="w-96 h-[42rem] max-h-64 object-fill" />
                </div>
                <div v-else-if="subField.type === 'video'" class="mb-4">
                  <video :src="formData[subField.name]" class="w-full max-h-64 object-cover" controls>
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div v-else-if="subField.type === 'audio'" class="mb-4">
                  <audio :src="formData[subField.name]" class="w-full" controls>
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div v-else-if="subField.type === 'document'" class="mb-4">
                  <a :href="formData[subField.name]" :download="`${subField.title}.pdf`"
                    class="inline-flex items-center px-4">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download {{ subField.title }}
                  </a>
                </div>
              </div>















                      <p v-else>
                        {{ getRefLabel(subField.resource, item[subField.name]) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="resource.tabs" class="mt-2 w-[95vw] lg:w-[82.5vw]">
    <resource_tabs 
    :resource="resource"
    :currentID="currentID"
    :initialData="initialData"
    :resources="resources"
    />
  </div>
</template>

<script>
import { getFilteredResources } from "../../../../../executables/accessControl";
import refOptionsService from "../../../../../executables/refOptionsService"
import print from "vue3-print-nb";
import { Carousel as ACarousel } from 'ant-design-vue';
import ResourceRenderer from "../../../../portal/resource_renderer.vue"
import resource_tabs from "./resource_tabs.vue";
export default {
directives: { print },
name: "app",
components: { ACarousel, ResourceRenderer, resource_tabs },
props: {
  resource: {
    type: Object,
    required: true,
  },
  initialData: {
    type: Object,
    required: false,
  },
  currentID:{
    type: String,
    required: false
  }
},
data() {
  return {
    formData: {},
    refOptions: [],
    resolvedTagLabels: {},
    tagLoading: false,
    resources: [],
  };
},
async created() {
  const roleId = localStorage.getItem("role");
  this.resources = await getFilteredResources(roleId);
  this.formData = this.initialData;
  this.fetchRefOptions();
  this.initializeTagLabels();
},
methods: {
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
          for (const tagId of this.formData[field.name]) {
            if (!this.resolvedTagLabels[field.name][tagId]) {
              this.resolvedTagLabels[field.name][tagId] =
                await this.getTagLabel(tagId, field.resource, field.field);
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
  formatDate(date) {
    return new Date(date).toLocaleDateString();
  },
  getValue(resource, id) {
    const myValue = this.refOptions[resource];

    if (!Array.isArray(myValue)) {
      // Ensure that myValue is an array before proceeding
      return null;
    }

    for (const obj of myValue) {
      // Check if the id of the current object matches the provided id
      if (obj.id === id) {
        // If a match is found, return the name of the object
        return obj.name;
      }
    }

    // If no match is found, return null (or handle the case as per your requirement)
    return null;
  },
  async fetchRefOptions() {
    this.refOptions = {};

    for (const field of this.resource.schema) {
      if (field.type === "ref" || field.type === "tags") {
        this.refOptions[field.name] = await refOptionsService.getRefOptions(
          field.resource,
          field.field
        );
      }
    }
  },
  getRefLabel(resourceName, refId) {
    const resource = this.resources.find((r) => r.name === resourceName);
    const field = resource.schema.find((f) => f.name === refId);
    return field ? field.title : "";
  },
  getSelectLabel(options, value) {
    const option = options.find((o) => o.value === value);
    return option ? option.label : "";
  },
  getRadioLabel(options, value) {
    const option = options.find((o) => o.value === value);
    return option ? option.label : "";
  },
},
};
</script>
