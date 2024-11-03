<template>
    <div :class="{ 'min-w-[16rem] mb-4': true, 'border-red-500 border': validationErrors[field.name] }">
      <label class="block font-bold text-gray-800">{{ field.title }}</label>
      <div v-if="field.type === 'text' || field.type === 'richtext'">
        <div v-if="field.type === 'richtext'">
          <QuillEditor
            v-model:content="formData[field.name]"
            @update:content="updateFormData(field.name, $event)"
            contentType="html"
            :toolbar="[
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']
            ]"
            class="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
          />
        </div>
        <input v-else v-model="formData[field.name]" type="text"
          class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      </div>
      <input v-else-if="field.type === 'email'" v-model="formData[field.name]" type="email"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'password'" v-model="formData[field.name]" type="password"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'phone'" v-model="formData[field.name]" type="tel"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'number'" v-model="formData[field.name]" type="number"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'decimal'" v-model="formData[field.name]" type="number" step="0.01"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'date'" :value="formatIsoDate(formData[field.name])"
        @input="updateFormData(field.name, $event.target.value)" type="date"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'datetime'" v-model="formData[field.name]" type="datetime-local"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <input v-else-if="field.type === 'time'" v-model="formData[field.name]" type="time"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <select v-else-if="field.type === 'ref'" v-model="formData[field.name]"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark">
        <option v-for="option in refOptions[field.name]" :key="option.id" :value="option.id">{{ option.name }}</option>
      </select>
      <select v-else-if="field.type === 'select'" v-model="formData[field.name]"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark">
        <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <div v-else-if="field.type === 'check'" class="flex items-center">
        <input v-model="formData[field.name]" type="checkbox" class="mr-2 focus:ring-2 focus:ring-secondary bg-cardDark" />
        <label class="font-bold text-gray-800">{{ field.title }}</label>
      </div>
      <div v-else-if="
        field.type === 'image array' ||
        field.type === 'video array' ||
        field.type === 'audio array' ||
        field.type === 'document array'
      ">
        <label class="block font-bold text-gray-800">{{ field.title }}</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          <div v-for="(file, index) in formData[field.name]" :key="index" class="relative">
            <img v-if="field.type === 'image array'" :src="getFilePreview(file)"
              class="w-full h-32 object-cover rounded-md" />
            <video v-else-if="field.type === 'video array'" :src="getFilePreview(file)" controls
              class="w-full h-32 object-cover rounded-md"></video>
            <audio v-else-if="field.type === 'audio array'" :src="getFilePreview(file)" controls
              class="w-full rounded-md"></audio>
            <div v-else class="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">{{ file.name }}</div>
            <button type="button" @click="removeFile(field.name, index)"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <label :for="'file-input-array-' + field.name"
            class="cursor-pointer bg-secondary text-textLight font-bold rounded-md px-4 py-2 hover:bg-secondary-darker flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
            Add Files
          </label>
          <span class="ml-3 text-sm text-gray-500">{{ formData[field.name]?.length || 0 }} file(s) selected</span>
          <input :id="'file-input-array-' + field.name" @change="handleFileUploadArray(field, $event)" type="file"
            :accept="getAcceptTypes(field.type)" multiple class="hidden" />
        </div>
      </div>
      <div v-else-if="
    field.type === 'image' ||
    field.type === 'video' ||
    field.type === 'audio' ||
    field.type === 'document'
  ">

    <div class="mb-4">
        <div class="relative">
            <img v-if="field.type === 'image'" :src="getFilePreview(formData[field.name])"
                class="w-full h-32 object-cover rounded-md" />
            <video v-else-if="field.type === 'video'" :src="getFilePreview(formData[field.name])" controls
                class="w-full h-32 object-cover rounded-md"></video>
            <audio v-else-if="field.type === 'audio'" :src="getFilePreview(formData[field.name])" controls
                class="w-full rounded-md"></audio>
            <div v-else class="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">{{ formData[field.name]?.name }}</div>

        </div>
    </div>
    <div class="flex items-center">
        <label :for="'file-input-' + field.name"
            class="cursor-pointer bg-secondary text-textLight font-bold rounded-md px-4 py-2 hover:bg-secondary-darker flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
            Choose File
        </label>
        <span class="ml-3 text-sm text-gray-500">{{ formData[field.name]?.name || 'No file selected' }}</span>
        <input :id="'file-input-' + field.name" @change="handleFileUpload(field, $event)" type="file"
            :accept="getAcceptTypes(field.type)" class="hidden" />
    </div>
</div>

      <input v-else-if="field.type === 'color'" v-model="formData[field.name]" type="color"
        class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
      <div v-else-if="field.type === 'radio'">
        <div v-for="option in field.options" :key="option.value" class="flex items-center">
          <input v-model="formData[field.name]" type="radio" :value="option.value"
            class="mr-2 focus:ring-2 focus:ring-secondary bg-cardDark" />
          <label>{{ option.label }}</label>
        </div>
      </div>
      <div v-else-if="field.type === 'tags'" class="mb-6 text-xs font-extrabold flex-1 basis-32 min-w-[8rem]">
        <div class="flex flex-wrap items-center gap-2">
          <div v-if="field.tagInputType === 'refs'" class="flex-1">
            <div class="flex items-center">
              <select v-model="inputValue"
                class="form-select rounded-l-md px-3 py-2 focus:outline-none w-44 focus:ring-2 focus:ring-secondary bg-cardDark">
                <option value="" disabled>Select an option</option>
                <option v-for="option in refOptions[field.name]" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
              <button type="button" @click="addTag(field.name)"
                class="bg-secondary rounded-r-md px-4 py-2 hover:bg-secondary-darker transition duration-150 ease-in-out">Add</button>
            </div>
          </div>
          <div v-else class="flex-1">
            <input type="text" v-model="inputValue" placeholder="Add a tag" @keydown.enter="addTag(field.name)"
              class="rounded-md px-3 py-2 w-[16rem] focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark" />
          </div>
        </div>
        <div class="mt-4 rounded-md">
          <div class="flex flex-wrap gap-2">
            <span v-for="(tag, index) in formData[field.name]" :key="index"
              class="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-base font-bold flex items-center hover:bg-gray-300 transition duration-150 ease-in-out cursor-pointer"
              @click="removeTag(field.name, index)">
              {{ resolvedTagLabels[field.name][tag] || "Loading..." }}
              <span class="ml-2 font-bold">&times;</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { h } from 'vue';
  import { QuillEditor } from '@vueup/vue-quill';
  
  
  export default {
    name: 'FieldRenderer',
    components: { QuillEditor },
    props: {
      field: { type: Object, required: true },
      formData: { type: Object, required: true },
      validationErrors: { type: Object, required: true },
      refOptions: { type: Object, required: true },

    },
    data() {
      return {
        inputValue: '',
      };
    },


    methods: {
      updateFormData(fieldName, value) {
        this.$emit('update-form-data', { fieldName, value });
      },

      getFilePreview(file) {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        } else if (typeof file === 'string') {
          return file;
        } else {
          return '';
        }
      },
      getAcceptTypes(type) {
        switch (type) {
          case 'image':
          case 'image array':
            return 'image/*';
          case 'video':
          case 'video array':
            return 'video/*';
          case 'audio':
          case 'audio array':
            return 'audio/*';
          case 'document':
          case 'document array':
            return '.doc,.docx,.pdf';
          default:
            return '';
        }
      },
      formatIsoDate(isoDateString) {
        const isoDate = new Date(isoDateString);
        if (!isNaN(isoDate.getTime())) {
          const day = isoDate.getDate();
          const month = isoDate.getMonth() + 1;
          const year = isoDate.getFullYear();
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        } else {
          return isoDateString;
        }
      },
      addTag(fieldName) {
        if (this.inputValue.trim()) {
          this.formData[fieldName].push(this.inputValue.trim());
          this.inputValue = '';
        }
      },
      removeTag(fieldName, index) {
        this.formData[fieldName].splice(index, 1);
      },
      handleFileUploadArray(field, event) {
        const newFiles = Array.from(event.target.files);
        this.formData[field.name] = this.formData[field.name]
          ? [...this.formData[field.name], ...newFiles]
          : [...newFiles];
      },
      removeFile(fieldName, index) {
        this.formData[fieldName].splice(index, 1);
      },
    },
  };
  </script>
  