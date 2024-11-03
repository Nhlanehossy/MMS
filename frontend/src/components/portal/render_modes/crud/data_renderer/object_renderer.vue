<template>
    <div class=" w-[95vw] lg:w-[82.5vw]">
      <div class="bg-cardLight rounded-lg px-6 sm:p-8 lg:px-10">
        <div class="flex items-center justify-between">
  
          <button
            class="bg-gray-500 text-white mt-2 rounded p-2 hover:bg-gray-600 transition-colors duration-300 flex  justify-center items-center mb-4"
            v-print="'#report'">
            <i class="fas fa-print"></i>
          </button>
          <action_dispatcher :resource="resource" :item="formData" />
        </div>
        <div id="report" class="rounded-lg overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="field in resource.schema" :key="field.name" :class="{
              'col-span-1': !['image', 'object', 'richtext', 'image array', 'object array'].includes(field.type),
              'sm:col-span-2 lg:col-span-3': ['image', 'object', 'richtext', 'image array', 'object array'].includes(field.type)
            }">
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h3 class="font-bold text-sm text-secondary mb-2">{{ field.title }}</h3>
                <!-- Text, Email, Phone, Number, Decimal -->
                <div v-if="['text', 'email', 'phone', 'number', 'decimal'].includes(field.type)">
                  <p class="text-text">{{ formData[field.name] }}</p>
                </div>
                <!-- Rich Text -->
                <div v-else-if="field.type === 'richtext'" class="prose prose-sm max-w-full">
                  <div v-html="formData[field.name]"></div>
                </div>
                <!-- Password -->
                <div v-else-if="field.type === 'password'">
                  <p class="text-text">•••••••••</p>
                </div>
                <!-- Date, DateTime, Time -->
                <div v-else-if="['date', 'datetime', 'time'].includes(field.type)">
                  <p class="text-text">{{ formatDate(formData[field.name]) }}</p>
                </div>
                <!-- Reference or Select -->
                <div v-else-if="field.type === 'ref' || field.type === 'select'">
                  <p class="text-text">
                    {{ field.type === 'ref' ? getValue(field.name, formData[field.name]) : getSelectLabel(field.options,
                      formData[field.name]) }}
                  </p>
                </div>
                <!-- Checkbox -->
                <div v-else-if="field.type === 'check'">
                  <p class="text-text">{{ formData[field.name] ? "Yes" : "No" }}</p>
                </div>
                <!-- Image Array -->
                <div v-else-if="field.type === 'image array'" class="w-full">
                  <Atomicgallery :images="formData[field.name]" />
                </div>
                <!-- Radio -->
                <div v-else-if="field.type === 'radio'">
                  <p class="text-text">
                    {{ getRadioLabel(field.options, formData[field.name]) }}
                  </p>
                </div>
                <!-- Image, Video, Audio, Document -->
                <div v-else-if="['image', 'video', 'audio', 'document'].includes(field.type)" class="w-full">
                  <div v-if="field.type === 'image'" class="mb-4 flex justify-center">
                    <img :src="formData[field.name]" :alt="field.title"
                      class="w-96 h-96 max-h-64 object-cover rounded-lg shadow-md" />
                  </div>
                  <div v-else-if="field.type === 'video'" class="mb-4">
                    <video :src="formData[field.name]" class="w-full max-h-64 object-cover rounded-lg shadow-md" controls>
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
                      class="inline-flex items-center px-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md shadow-sm">
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
                    class="w-8 h-8 rounded-full shadow-lg ring-2 ring-white mr-4"></div>
                  <span class="text-text">{{ formData[field.name] }}</span>
                </div>
                <!-- Range -->
                <div v-else-if="field.type === 'range'">
                  <p class="text-text">{{ formData[field.name] }}</p>
                </div>
                <!-- Tags -->
                <div v-else-if="field.type === 'tags'" class="flex flex-wrap">
                  <span v-for="(tag, index) in formData[field.name]" :key="index"
                    class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2">
                    {{ resolvedTagLabels[field.name][tag] || "Loading..." }}
                  </span>
                </div>
                <!-- Object -->
                <div v-else-if="field.type === 'object'" class="w-full">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="subField in field.schema" :key="subField.name" class="object-field">
                      <div class="font-semibold text-xs text-secondary mb-1">{{ subField.title }}</div>
                      <div class="text-text">
                        {{ formData[field.name][subField.name] }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Object Array -->
                <div v-else-if="field.type === 'object array'" class="w-full">
                  <div v-for="(item, index) in formData[field.name]" :key="index"
                    class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div v-for="subField in field.schema" :key="subField.name">
                        <h4 class="text-sm font-semibold text-secondary mb-1">
                          {{ subField.title }}
                        </h4>
                        <p v-if="subField.type !== 'ref'" class="text-text">
                          {{ item[subField.name] }}
                        </p>
                        <p v-else class="text-text">
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
  </template>
  
  <script>
  import { Resources } from "../../../../../data/resources";
  import refOptionsService from "../../../../../executables/refOptionsService"
  import print from "vue3-print-nb";
  import Atomicgallery from "../../gallery/atomic_gallery.vue";
  import action_dispatcher from "../../../../action_dispatcher.vue";
  
  export default {
    directives: { print },
    name: "app",
    components: { Atomicgallery, action_dispatcher },
    props: {
      resource: {
        type: Object,
        required: true,
      },
      initialData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        formData: {},
        refOptions: [],
        resolvedTagLabels: {},
        tagLoading: false,
      };
    },
    created() {
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
        const resource = Resources.find((r) => r.name === resourceName);
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
  