<template>
  <div :class="showSubmit ? 'w-[95vw] lg:m-0 lg:w-[100%] card rounded-lg px-6 sm:p-8 lg:px-10' : ''">
    <form @submit.prevent="submitForm" class="py-8 dynamic-form">
      <div
        class="flex flex-wrap gap-4 [&>*:has([data-type='object-array'])]:w-full [&>*:has([data-type='richtext'])]:w-full">
        <div v-for="field in resource.schema" :key="field.name" :class="[
          field.type === 'object array' ? 'w-full' : 'min-w-full'
        ]">
          <div v-if="field.type === 'object'">
            <h3 class="text-xl font-bold mb-4">{{ field.title }}</h3>
            <DynamicForm :resource="{ schema: field.schema }" :initial-data="formData[field.name]" :isAdding="isAdding"
              :showSubmit="false" v-model:form-data="formData[field.name]" />
          </div>
          <div class="mt-20" v-else-if="field.type === 'object array'">
            <h3 class="text-3xl font-bold mb-4">{{ field.title }}</h3>
            <div class="flex flex-wrap" :class="{ 'max-w-[calc(100%-2rem)]': formData[field.name].length > 1 }">
              <div v-for="(item, index) in formData[field.name]" :key="index"
                class="relative card flex-1">
                <div v-for="subField in field.schema" :key="subField.name" :class="[
                  subField.type === 'object array' ? 'w-full' : 'min-w-full']">
                  <!-- Handle file type fields within object array -->
                  <div v-if="['image', 'video', 'audio', 'document'].includes(subField.type)">
                    <label class="block mb-2">{{ subField.title }}</label>

                    <!-- File Preview -->
                    <div v-if="getFilePreview(subField.name, subField.type, index, field.name)" class="mb-2">
                      <!-- Image Preview -->
                      <img v-if="subField.type === 'image'"
                        :src="getFilePreview(subField.name, subField.type, index, field.name)"
                        class="max-h-32 object-contain mb-2 rounded-md"
                        :alt="getFileName(subField.name, index, field.name)" />

                      <!-- Video Preview -->
                      <video v-else-if="subField.type === 'video'"
                        :src="getFilePreview(subField.name, subField.type, index, field.name)" controls
                        class="max-h-32 w-full object-contain mb-2 rounded-md">
                      </video>

                      <!-- Audio Preview -->
                      <audio v-else-if="subField.type === 'audio'"
                        :src="getFilePreview(subField.name, subField.type, index, field.name)" controls
                        class="w-full mb-2">
                      </audio>

                      <!-- Document Preview -->
                      <div v-else-if="subField.type === 'document'"
                        class="flex items-center gap-2 mb-2 p-2 bg-cardDark rounded-md">
                        <i class="fas fa-file-alt text-2xl"></i>
                        <span>{{ getFileName(subField.name, index, field.name) }}</span>
                        <a :href="getFilePreview(subField.name, subField.type, index, field.name)" target="_blank"
                          class="text-blue-500 hover:text-blue-700">
                          {{ translationKeys.View }}
                        </a>
                      </div>

                      <!-- Remove Button for Preview -->
                      <button type="button" @click="removeFile(subField.name, index, field.name)"
                        class="text-red-500 hover:text-red-700 mb-2">
                        <i class="fas fa-times"></i> {{ translationKeys.Remove }}
                      </button>
                    </div>

                    <!-- File Input -->
                    <div class="flex items-center">
                      <label :for="'file-input-' + field.name + '-' + index + '-' + subField.name"
                        class="cursor-pointer bg-primary px-4 py-2 rounded-md flex items-center">
                        <i class="fas fa-upload mr-2"></i>
                        {{ getFilePreview(subField.name, subField.type, index, field.name) ?
                          translationKeys.Change : translationKeys.Browse }}
                      </label>
                      <span class="ml-3 text-sm">
                        {{ getFileName(subField.name, index, field.name) || translationKeys.NoFileChosen }}
                      </span>
                      <input :id="'file-input-' + field.name + '-' + index + '-' + subField.name" type="file"
                        :accept="getAcceptTypes(subField.type)"
                        @change="(e) => handleFileUpload(subField, e, index, field.name)" class="hidden" />
                    </div>
                  </div>

                  <!-- Pass through to DynamicForm for other field types -->
                  <div v-else>
                    <DynamicForm :resource="{ schema: [subField] }" :initial-data="item" :isAdding="isAdding"
                      :showSubmit="false" v-model:form-data="formData[field.name][index]" />
                  </div>
                </div>

                <!-- Remove Object Button -->
                <button type="button" @click="removeArrayItem(field.name, index)"
                  class="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <!-- Add New Object Button -->
              <div @click="addArrayItem(field.name)"
                class="flex items-center justify-center border-dashed border-2 border-gray-400 rounded-md p-4 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out flex-1">
                <i class="fas fa-plus mr-2 text-gray-600"></i>
                <span class="text-gray-600">{{ translationKeys.Add }} More </span>
              </div>
            </div>

          </div>
          <div v-else-if="field.type !== 'object' && field.type !== 'object array'">
            <div class="flex-1 basis-32 min-w-[8rem]" v-if="field.type === 'text' || field.type === 'richtext'">
              <label class="block mb-2">{{ field.title }}</label>
              <div v-if="field.type === 'richtext'">
                <QuillEditor v-model:content="formData[field.name]" @update:content="formData[field.name] = $event"
                  contentType="html" :toolbar="[
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],

                    ['clean']
                  ]" class="w-full p-2.5" />
              </div>
              <input :placeholder="`please enter ${field.title}`" v-else v-model="formData[field.name]" type="text"
                class="w-full px-3 py-2 bg-cardDark border border-textLighter rounded-md" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'email'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="email"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'me'">
              <input :placeholder="`please enter ${field.title}`" :value="getMeValue(field.name)" type="text" class="me"
                readonly />
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'password'">
              <label class="block mb-2">{{ ` ${field.title}` }} </label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="password"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />

              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'phone'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="tel"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'number'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="number"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'decimal'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="number"
                step="0.01" class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'date'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" :value="formatIsoDate(formData[field.name])"
                @input="updateDate(field.name, $event.target.value)" type="date"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{ field.name }} is
                required<i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'datetime'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="datetime-local"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{ field.name }} is
                required<i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'time'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="time"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div v-if="field.type === 'ref'" class="flex-1 basis-32 min-w-[8rem]">
              <label class="block mb-2">Select {{ field.title }}</label>
              <select v-model="formData[field.name]"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter">
                <option v-for="option in refOptions[field.name]" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'select' || field.type === 'status'">
              <label class="block mb-2">Select {{ field.title }}</label>
              <select v-model="formData[field.name]"
                class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter">
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'check'">
              <div class="flex items-center">
                <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="checkbox"
                  class="mr-2" />
                <label>{{ field.title }}</label>
              </div>
            </div>
            <div v-else-if="field.type === 'icon'" class="flex-1 basis-32 min-w-[8rem]">
              <label class="block mb-2">{{ field.title }}</label>
              <icon_input v-model="formData[field.name]" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">
                {{ validationErrors[field.name] }} <i class="fa fa-warning"></i>
              </p>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="
              field.type === 'image array' ||
              field.type === 'video array' ||
              field.type === 'audio array' ||
              field.type === 'document array'
            ">
              <label class="block mb-2">{{ field.title }}</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                <div v-for="(file, index) in formData[field.name]" :key="index" class="relative">
                  <img v-if="field.type === 'image array'" :src="getImagePreview(file)"
                    class="w-full h-32 object-cover rounded-md" />
                  <video v-else-if="field.type === 'video array'" :src="getFilePreview(file)" controls
                    class="w-full h-32 object-cover rounded-md"></video>
                  <audio v-else-if="field.type === 'audio array'" :src="getFilePreview(file)" controls
                    class="w-full rounded-md"></audio>
                  <div v-else class="w-full h-32 flex items-center justify-center rounded-md">
                    {{ file.name }}
                  </div>
                  <button type="button" @click="removeFile(field.name, index)"
                    class="absolute top-1 right-1 rounded-full p-1">
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
                  class="cursor-pointer rounded-md px-4 py-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ translationKeys.AddFiles }}
                </label>
                <span class="ml-3 text-sm w-[70vh]">
                  {{ formData[field.name]?.length || 0 }} file(s) selected
                </span>
                <input :placeholder="`please enter ${field.title}`" :id="'file-input-array-' + field.name"
                  @change="handleFileUploadArray(field, $event)" type="file" :accept="getAcceptTypes(field.type)"
                  multiple class="hidden" />
              </div>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'radio'">
              <label class="block mb-2">{{ field.title }}</label>
              <div v-for="option in field.options" :key="option.value" class="flex items-center">
                <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="radio"
                  :value="option.value" class="mr-2" />
                <label>{{ option.label }}</label>
              </div>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-if="
              field.type === 'image' ||
              field.type === 'video' ||
              field.type === 'audio' ||
              field.type === 'document'
            ">

              <div v-if="getFilePreview(field.name)">
                <!-- For files within object arrays -->
                <div v-if="field.type === 'document'" class="mb-4">
                  <label class="block mb-2">{{ field.title }}</label>

                  <!-- File Preview -->
                  <div v-if="getFilePreview(field.name, field.type, index, 'documents')" class="mb-2">
                    <!-- Image Preview -->
                    <img v-if="getFileType(field.name, index, 'documents').startsWith('image/')"
                      :src="getFilePreview(field.name, field.type, index, 'documents')"
                      class="max-h-32 object-contain mb-2" :alt="getFileName(field.name, index, 'documents')" />

                    <!-- Video Preview -->
                    <video v-else-if="getFileType(field.name, index, 'documents').startsWith('video/')"
                      :src="getFilePreview(field.name, field.type, index, 'documents')" controls
                      class="max-h-32 w-full object-contain mb-2"></video>

                    <!-- Audio Preview -->
                    <audio v-else-if="getFileType(field.name, index, 'documents').startsWith('audio/')"
                      :src="getFilePreview(field.name, field.type, index, 'documents')" controls
                      class="w-full mb-2"></audio>

                    <!-- Document Preview -->
                    <div v-else class="flex items-center gap-2 mb-2">
                      <i class="fas fa-file-alt text-2xl"></i>
                      <span>{{ getFileName(field.name, index, 'documents') }}</span>
                      <a :href="getFilePreview(field.name, field.type, index, 'documents')" target="_blank"
                        class="text-blue-500 hover:text-blue-700">
                        {{ translationKeys.View }}
                      </a>
                    </div>

                    <!-- Remove Button -->
                    <button type="button" @click="removeFile(field.name, index, 'documents')"
                      class="text-red-500 hover:text-red-700">
                      <i class="fas fa-times"></i> {{ translationKeys.Remove }}
                    </button>
                  </div>

                  <!-- File Input -->
                  <div class="flex items-center">
                    <label :for="'file-input-' + field.name + '-' + index"
                      class="cursor-pointer rounded-md px-4 py-2 flex items-center">
                      <i class="fas fa-upload mr-2"></i>
                      {{ getFilePreview(field.name, field.type, index, 'documents') ? translationKeys.Change :
                        translationKeys.Browse }}
                    </label>
                    <input :id="'file-input-' + field.name + '-' + index"
                      @change="(e) => handleFileUpload(field, e, index, 'documents')" type="file"
                      :accept="getAcceptTypes(field.type)" class="hidden" />
                  </div>
                </div>
              </div>
              <div class="flex items-center">

                <label :for="'file-input-' + field.name" class="cursor-pointer rounded-md px-4 py-2 flex items-center">
                  <i class="fas fa-upload mr-2"></i>
                  {{ translationKeys.Browse }}
                </label>
                <span class="ml-3 text-sm">
                  {{ formData[field.name]?.name || translationKeys.NoFileChosen }}
                </span>
                <input :placeholder="`please enter ${field.title}`" :id="'file-input-' + field.name"
                  @change="handleFileUpload(field, $event)" type="file" :accept="getAcceptTypes(field.type)"
                  class="hidden" />
              </div>
            </div>
            <div class="flex-1 basis-32 min-w-[8rem]" v-else-if="field.type === 'color'">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="color"
                class="w-full px-3 py-2 rounded-md" />
              <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
            </div>
            <div v-else-if="field.type === 'range'" class="flex-1 basis-32 min-w-[8rem]">
              <label class="block mb-2">{{ field.title }}</label>
              <input :placeholder="`please enter ${field.title}`" v-model="formData[field.name]" type="range"
                :min="field.min || 0" :max="field.max || 100" :step="field.step || 1" class="w-full" />
            </div>
            <div v-else-if="field.type === 'tags'" class="mb-6 flex-1 basis-32 min-w-[8rem]">
              <label class="block mb-2">{{ field.title }}</label>
              <div class="flex flex-wrap items-center gap-2">
                <div v-if="field.tagInputType === 'refs'" class="flex-1">
                  <div class="flex items-center">
                    <select v-model="inputValue"
                      class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter">
                      <option value="" disabled>{{ translationKeys.SelectAnOption }}</option>
                      <option v-for="option in refOptions[field.name]" :key="option.id" :value="option.id">
                        {{ option.name }}
                      </option>
                    </select>
                    <button type="button" @click="addTag(field.name)" class="bg-primary px-4 py-2 rounded-md">
                      {{ translationKeys.Add }}
                    </button>
                  </div>
                  <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                    validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
                </div>
                <div v-else class="flex-1">
                  <input :placeholder="`please enter ${field.title}`" type="text" v-model="inputValue"
                    placeholder="Add a tag" @keydown.enter.prevent="addTag(field.name)"
                    class="w-full px-3 py-2 rounded-md" />
                  <p v-if="validationErrors[field.name]" class="mt-1 text-sm validation-error">{{
                    validationErrors[field.name] }} <i class="fa fa-warning"></i></p>
                </div>
              </div>
              <div class="mt-4 rounded-md">
                <div class="flex flex-wrap gap-2">
                  <span v-if="isAdding" v-for="(tag, index) in formData[field.name]" :key="index"
                    class="rounded-lg px-4 py-2 tag" @click="removeTag(field.name, index)">
                    {{ field.tagInputType === "refs" ? resolvedTagLabels[field.name][tag] : tag }}
                    <span class="ml-2 font-bold">&times;</span>
                  </span>
                  <div v-else class="flex flex-wrap gap-2">
                    <span v-for="(tag, index) in formData[field.name]" :key="index" class="px-4 py-2 rounded-lg tag"
                      @click="removeTag(field.name, index)">
                      {{ resolvedTagLabels[field.name][tag] || "Loading..." }}
                      <span class="ml-2 font-bold">&times;</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showSubmit" class="mt-4">
        <button v-if="!returnDataOnly" type="submit" :disabled="isUploading || actionLoading"
          class="bg-primary px-4 py-2 rounded-md">
          {{ isUploading || actionLoading ? translationKeys.Processing : translationKeys.Submit }}
        </button>
        <button v-if="returnDataOnly" type="button" @click="emitFormData" class="bg-primary px-4 py-2 rounded-md">
          {{ translationKeys.Apply }}
        </button>
      </div>
      <div v-if="isUploading || actionLoading" class="mt-2">
        <Loader />
      </div>
    </form>
  </div>
</template>

<script>
import DynamicTable from "./crud_view_renderer.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic/build/ckeditor";
import CKEditor from "@ckeditor/ckeditor5-vue";
import { QuillEditor } from '@vueup/vue-quill';
import Loader from "../../../u_i/sf_loader.vue";
import axios from "axios";
import firebase from "firebase/compat/app";
import refOptionsService from "../../../../executables/refOptionsService";
import "firebase/compat/storage";
import { translationKeys } from '@/executables/translation';
import { toast } from "vue3-toastify";
import icon_input from "./icon_input.vue";
import * as Yup from "yup";
import { Item } from "ant-design-vue/es/menu";





export default {
  name: "DynamicForm",
  props: {
    resource: {
      type: Object,
      required: true,
    },
    initialData: {
      type: Object,
      required: false,
    },
    isAdding: {
      type: Boolean,
      required: true,
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    redirectTo: {
      type: String,
      required: false,
    },
    returnDataOnly: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      editor: ClassicEditor,
      translationKeys: translationKeys,
      editorConfig: {

        toolbar: [
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'blockQuote', 'codeBlock', '|',
          'heading', '|',
          'numberedList', 'bulletedList', '|',
          'subscript', 'superscript', '|',
          'outdent', 'indent', '|',
          'alignment', '|',
          'fontSize', 'fontColor', 'fontBackgroundColor', '|',
          'undo', 'redo', '|',
          'removeFormat'
        ],
        fontSize: {
          options: ['small', 'default', 'big', 'large']
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
          ]
        }
      },
      me: localStorage.getItem("userId"),
      actionLoading: false,
      isUploading: false,
      refOptions: [],
      refOptionsMap: {},
      formData: { ...this.initialData },
      showFileInput: {},
      validationErrors: {},
      selectedRef: "",
      resolvedTagLabels: {},
      tagLoading: false,
      uploadProgress: {},
    };
  },
  components: { ckeditor: CKEditor.component, QuillEditor, DynamicTable, Loader, icon_input },
  async created() {

    this.inputValue = "";
    console.log("Created hook called");
    this.initFormData();
    this.initializeTagLabels();
    await this.fetchRefOptions();

    for (const field of this.resource.schema) {
      if (
        field.type === "image" ||
        field.type === "video" ||
        field.type === "audio" ||
        field.type === "document"
      ) {
        this.showFileInput[field.name] = false;
      }
    }
  },
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('update:form-data', newValue);
        this.initializeTagLabels();
      },
      deep: true,
    },
  },
  async mounted() {
    console.log(this.resource.schema);
    this.initializeFirebase();
  },
  methods: {
    async initializeFirebase() {
      try {
        // Check if Firebase is already initialized
        if (!firebase.apps.length) {
          const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`);

          if (response.data && response.data.data && response.data.data.length > 0) {
            const firebaseConfig = response.data.data[0].FirebaseConfig;
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase initialized with dynamic config:', firebaseConfig);
          } else {
            throw new Error('No configuration data found');
          }
        } else {
          console.log('Firebase already initialized');
        }
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    },


    getMeValue(fieldName) {
      if (this.formData[fieldName] === 'current_user_id') {
        return localStorage.getItem("userId");
      }
      return this.formData[fieldName];
    },

    emitFormData() {
      this.$emit('form-data', this.formData);
    },

    async getTagLabel(tagId, resource, fieldName) {
      console.log(' hhhhhhhhhhhhhhhhhhhhhhhh', tagId, resource, fieldName);
      try {
        const options = await refOptionsService.getRefOptions(
          resource,
          fieldName
        );
        console.log(options);
        const option = options.find((opt) => opt.id == tagId);
        return option ? option.name : "";
      } catch (error) {
        console.error(error);
        return "";
      }
    },

    async initializeTagLabels() {
      console.log('Initializing tags with formData:', this.formData);

      this.tagLoading = true;
      try {
        for (const field of this.resource.schema) {
          if (field.type === "tags" && field.tagInputType === "refs") {
            this.resolvedTagLabels[field.name] = {};

            // Check if formData[field.name] exists and is an array
            if (Array.isArray(this.formData[field.name])) {
              for (const tagId of this.formData[field.name]) {
                if (!this.resolvedTagLabels[field.name][tagId]) {
                  console.log(`Fetching tag label for ID: ${tagId}`);
                  const label = await this.getTagLabel(tagId, field.resource, field.field);
                  this.resolvedTagLabels[field.name][tagId] = label;
                }
              }
            } else {
              // Initialize as an empty array if it doesn't exist or isn't an array
              this.formData[field.name] = [];
            }
          }
        }
      } catch (error) {
        console.error('Error initializing tag labels:', error);
      } finally {
        this.tagLoading = false;
      }
    }
    ,
    getFilePreview(fieldName, fileType, arrayIndex = null, arrayField = null) {
      let file;

      // Handle files in object arrays
      if (arrayIndex !== null && arrayField !== null) {
        if (!this.formData[arrayField][arrayIndex]) return '';
        file = this.formData[arrayField][arrayIndex][fieldName];
      } else {
        file = this.formData[fieldName];
      }

      // Handle File objects and URLs
      if (file instanceof File) {
        return URL.createObjectURL(file);
      } else if (typeof file === 'string' && file) {
        return file;  // Return the URL directly
      }

      return '';
    },

    toggleFileInput(fieldName) {
      this.showFileInput, fieldName, !this.showFileInput[fieldName];
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

    getAcceptTypes(type) {
      switch (type) {
        case "image":
        case "image array":
          return "image/*";
        case "video":
        case "video array":
          return "video/*";
        case "audio":
        case "audio array":
          return "audio/*";
        case "document":
        case "document array":
          return ".doc,.docx,.pdf";
        default:
          return "";
      }
    },

    addTag(fieldName) {
      console.log('addTag called with fieldName:', fieldName);
      if (this.inputValue.trim()) {
        this.formData[fieldName] = [
          ...this.formData[fieldName],
          this.inputValue.trim(),
        ];
        this.inputValue = "";
      }
    },
    removeTag(fieldName, index) {
      this.formData[fieldName] = [
        ...this.formData[fieldName].slice(0, index),
        ...this.formData[fieldName].slice(index + 1),
      ];
    },



    getImagePreview(file) {
      if (file instanceof File) {
        // Case 1: Received a File object
        return URL.createObjectURL(file);
      } else if (Array.isArray(file)) {
        // Case 2: Received an array
        if (typeof file[0] === "string") {
          // Array of strings (download URLs)
          return file[0]; // Return the first URL in the array for preview
        } else {
          // Array of File objects
          return URL.createObjectURL(file[0]); // Create object URL for the first File object
        }
      } else if (typeof file === "string") {
        // Case 3: Received a single download URL
        return file;
      } else {
        // Invalid input
        return "";
      }
    },

    initFormData() {
      if (this.isAdding) {
        this.formData = {};
        for (const field of this.resource.schema) {
          if (typeof this.initialData[field.name] !== "undefined") {
            this.formData[field.name] = this.initialData[field.name];
          } else {
            // Initialize the field based on its type
            switch (field.type) {
              case "text":
              case "richtext":
              case "email":
              case "password":
              case "phone":
              case "number":
              case "decimal":
              case "date":
              case "datetime":
              case "time":
              case "color":
              case "icon":
              case "range":
                this.formData[field.name] = "";
                break;
              case "boolean":
              case "check":
                this.formData[field.name] = false;
                break;
              case "me":
                this.formData[field.name] = 'current_user_id';
                break;
              case "radio":
              case "select":
                this.formData[field.name] = field.options[0].value;
                break;
              case "ref":
                this.formData[field.name] = "";
                break;
              case "tags":
                this.formData[field.name] = [];
                break;
              case "object":
                this.formData[field.name] = {};
                for (const subField of field.schema) {
                  this.formData[field.name][subField.name] = "";
                }
                break;
              case "object array":
                this.formData[field.name] = [{}];
                for (const subField of field.schema) {
                  this.formData[field.name][0][subField.name] = "";
                }
                break;
            }
          }
        }
      } else {
        this.formData = { ...this.initialData };
        for (const field of this.resource.schema) {
          if (field.type === "object array") {
            if (!this.formData[field.name]) {
              this.formData[field.name] = [{}];
              for (const subField of field.schema) {
                this.formData[field.name][0][subField.name] = "";
              }
            } else {
              for (const item of this.formData[field.name]) {
                for (const subField of field.schema) {
                  if (typeof item[subField.name] === "undefined") {
                    item[subField.name] = "";
                  }
                }
              }
            }
          }
          else if (typeof this.formData[field.name] === "undefined") {
            // Initialize the field based on its type
            switch (field.type) {
              case "text":
              case "richtext":
              case "email":
              case "password":
              case "phone":
              case "number":
              case "decimal":
              case "date":
              case "datetime":
              case "time":
              case "color":
              case "icon":
              case "range":
                this.formData[field.name] = "";
                break;
              case "check":
                this.formData[field.name] = false;
                break;
              case "radio":
              case "select":
                this.formData[field.name] = field.options[0].value;
                break;
              case "me":
                this.formData[field.name] = 'current_user_id';
                break;
              case "ref":
                this.formData[field.name] = "";
                break;
              case "tags":
                this.formData[field.name] = [];
                break;
              case "object":
                this.formData[field.name] = {};
                for (const subField of field.schema) {
                  this.formData[field.name][subField.name] = "";
                }
                break;
            }
          }

          for (const field of this.resource.schema) {
            if (field.type === 'me' && this.formData[field.name] === 'current_user_id') {
              this.formData[field.name] = localStorage.getItem("userId");
            }
          }
        }
      }
    },
    addArrayItem(fieldName) {
      const field = this.resource.schema.find(f => f.name === fieldName);
      const newItem = {};
      field.schema.forEach(subField => {
        newItem[subField.name] = subField.type === 'object' || subField.type === 'object array' ? {} : '';
      });
      this.formData[fieldName].push(newItem);
    },
    removeArrayItem(fieldName, index) {
      this.formData[fieldName].splice(index, 1);
    },

    // Generic file preview method
    getFilePreview(fieldName, fileType, arrayIndex = null, arrayField = null) {
      let file;

      // Handle files in object arrays
      if (arrayIndex !== null && arrayField !== null) {
        file = this.formData[arrayField][arrayIndex][fieldName];
      } else {
        file = this.formData[fieldName];
      }

      // Handle File objects and URLs
      if (file instanceof File) {
        return URL.createObjectURL(file);
      } else if (typeof file === 'string' && file) {
        return file;  // Return the URL directly
      }

      return '';
    },

    // Get file name from URL or File object
    getFileName(fieldName, arrayIndex = null, arrayField = null) {
      let file;

      if (arrayIndex !== null && arrayField !== null) {
        file = this.formData[arrayField][arrayIndex][fieldName];
      } else {
        file = this.formData[fieldName];
      }

      if (file instanceof File) {
        return file.name;
      } else if (typeof file === 'string') {
        // Extract filename from URL
        return file.split('/').pop().split('?')[0];
      }
      return '';
    },

    // Get file type from URL or File object
    getFileType(fieldName, arrayIndex = null, arrayField = null) {
      let file;

      if (arrayIndex !== null && arrayField !== null) {
        file = this.formData[arrayField][arrayIndex][fieldName];
      } else {
        file = this.formData[fieldName];
      }

      if (file instanceof File) {
        return file.type;
      } else if (typeof file === 'string') {
        const ext = file.split('.').pop().toLowerCase();
        const mimeTypes = {
          pdf: 'application/pdf',
          doc: 'application/msword',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          xls: 'application/vnd.ms-excel',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          // Add more mappings as needed
        };
        return mimeTypes[ext] || 'application/octet-stream';
      }
      return '';
    },
    handleFileUpload(field, event, arrayIndex = null, arrayField = null) {
      const file = event.target.files[0];
      if (!file) return;

      if (arrayIndex !== null && arrayField !== null) {
        // Create a new object to trigger reactivity
        const updatedArray = [...this.formData[arrayField]];
        updatedArray[arrayIndex] = {
          ...updatedArray[arrayIndex],
          [field.name]: file
        };
        this.formData[arrayField] = updatedArray;
      } else {
        this.formData[field.name] = file;
      }
    }, handleFileUploadArray(field, event) {
      const newFiles = Array.from(event.target.files);
      this.formData[field.name] = this.formData[field.name]
        ? [...this.formData[field.name], ...newFiles]
        : [...newFiles];
      this.showFileInput[field.name] = false;
    },
    removeFile(fieldName, index) {
      this.formData[fieldName] = [
        ...this.formData[fieldName].slice(0, index),
        ...this.formData[fieldName].slice(index + 1),
      ];
    },
    formatIsoDate(isoDateString) {
      // Create a Date object from the ISO date string
      const isoDate = new Date(isoDateString);

      // Check if the input string is a valid date
      if (!isNaN(isoDate.getTime())) {
        // Extract day, month, and year components
        const day = isoDate.getDate();
        const month = isoDate.getMonth() + 1; // Months are zero-based, so we add 1
        const year = isoDate.getFullYear();

        // Format the date as "year-month-day"
        const formattedDate = `${year}-${month
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        return formattedDate;
      } else {
        // Return the original input string if it's not a valid date
        return isoDateString;
      }
    },
    updateDate(fieldName, value) {
      // Update the formData with the new date value
      this.formData = {
        ...this.formData,
        [fieldName]: value,
      };
    },
    async validateFormData() {
      try {
        const schema = this.resource.schema.reduce((acc, field) => {
          if (field.validation) {
            acc[field.name] = field.validation;
          }
          return acc;
        }, {});

        // Create a Yup object schema
        const validationSchema = Yup.object().shape(schema);

        await validationSchema.validate(this.formData, { abortEarly: false });
        this.validationErrors = {};
        return true;
      } catch (err) {
        const validationErrors = {};

        // Check for inner errors
        const errors = err.inner || [{ path: '', message: err.message }];

        errors.forEach((error) => {
          const fieldName = error.path || 'general'; // Use 'general' for top-level errors
          validationErrors[fieldName] = error.message;
        });

        this.validationErrors = validationErrors;
        console.log(validationErrors)
        return false;
      }
    }



    ,
    async submitForm() {
      const isValid = await this.validateFormData();
      if (!isValid) {
        toast.error("Please fill in all required fields.", {
          position: "bottom-center",
        });
        return;
      }

      if (this.returnDataOnly) {
        this.$emit('form-data', this.formData);
        return;
      }

      this.isUploading = true;
      this.actionLoading = true;

      try {
        // Handle all file uploads before form submission
        for (const field of this.resource.schema) {
          // Case 1: Handle object arrays containing file fields
          if (field.type === 'object array') {
            const fileSubfields = field.schema.filter(subfield =>
              ['image', 'video', 'audio', 'document'].includes(subfield.type)
            );

            if (fileSubfields.length > 0 && Array.isArray(this.formData[field.name])) {
              for (let i = 0; i < this.formData[field.name].length; i++) {
                for (const subfield of fileSubfields) {
                  const file = this.formData[field.name][i][subfield.name];
                  if (file instanceof File) {
                    const storageRef = firebase.storage().ref();
                    const fileRef = storageRef.child(`${field.name}/${i}/${file.name}`);
                    await fileRef.put(file);
                    const downloadURL = await fileRef.getDownloadURL();
                    this.formData[field.name][i][subfield.name] = downloadURL;
                  }
                }
              }
            }
          }

          // Case 2: Handle single file fields
          else if (['image', 'video', 'audio', 'document'].includes(field.type)) {
            const file = this.formData[field.name];
            if (file instanceof File) {
              const storageRef = firebase.storage().ref();
              const fileRef = storageRef.child(`${field.name}/${file.name}`);
              await fileRef.put(file);
              const downloadURL = await fileRef.getDownloadURL();
              this.formData[field.name] = downloadURL;
            }
          }

          // Case 3: Handle file array fields
          else if (['image array', 'video array', 'audio array', 'document array'].includes(field.type)) {
            if (Array.isArray(this.formData[field.name])) {
              const updatedFiles = [];

              for (const file of this.formData[field.name]) {
                if (typeof file === 'string') {
                  // Already a URL, keep it
                  updatedFiles.push(file);
                } else if (file instanceof File) {
                  // Upload new file and get URL
                  const storageRef = firebase.storage().ref();
                  const fileRef = storageRef.child(`${field.name}/${file.name}`);
                  await fileRef.put(file);
                  const downloadURL = await fileRef.getDownloadURL();
                  updatedFiles.push(downloadURL);
                }
              }

              this.formData[field.name] = updatedFiles;
            }
          }
        }

        this.isUploading = false;
        this.actionLoading = false;

        // Form submission logic
        if (this.isAdding) {
          this.add();
        } else {
          this.edit();
        }

      } catch (error) {
        console.error(`Error uploading file: ${error.message}`);
        this.$swal.fire(
          "Error!",
          `Error uploading file: ${error.message}`,
          "error"
        );
        this.isUploading = false;
        this.actionLoading = false;
        return;
      }
    },
    add() {
      const dataToSend = { ...this.formData };
      for (const field of this.resource.schema) {
        if (field.type === 'me') {
          dataToSend[field.name] = this.getMeValue(field.name);
        }
      }
      const endpoint = this.resource.isUser ? `${this.resource.name}/register` : this.resource.name;
      this.actionLoading = true;
      axios
        .post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${endpoint}`,
          dataToSend
        )
        .then((response) => {
          this.$swal.fire("Success!", "item added successfully.", "success");
          if (this.redirectTo === "prev") {
            this.$router.go(-1);
          } else if (this.redirectTo === "current") {
            this.$router.go(0);
          } else if (this.redirectTo === "invoice") {
            const url = `/invoice/${response.data._id}`;
            this.$router.push(url);
          } else {
            console.log(this.redirectTo);
            this.$router.push(
              `/dashboard/${this.resource.path}`
            );
          }
        })
        .catch((error) => {
          console.error(`Error adding  ${this.resource.name}:`, error);
          this.$swal.fire(
            "Error!",
            `Error adding  ${this.resource.name}:${error.message}`,
            "error"
          );
        })
        .finally(() => {
          this.actionLoading = false;
        });
    },

    edit() {
      const dataToSend = { ...this.formData };
      const endpoint = this.resource.name == "profile" ? `users` : this.resource.name;
      // Remove the original field (e.g., 'images') if it exists

      this.actionLoading = true;
      axios
        .patch(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${endpoint}/${this.formData._id || this.formData.id
          }`,
          dataToSend
        )
        .then(() => {
          this.$swal.fire("Success!", "Item updated successfully.", "success");
          if (this.redirectTo === "prev") {
            this.$router.go(-1);
          } else if (this.redirectTo === "current") {
            this.$router.go(0);
          } else if (this.redirectTo === "invoice") {
            const url = `/invoice/${response.data._id}`;
            this.$router.push(url);
          } else {
            console.log(this.redirectTo);
            this.$router.push(
              `/dashboard/${this.resource.path}`
            );
          }
        })
        .catch((error) => {
          console.error(
            `Error updating  ${this.resource.name}:`,
            error.message
          );
          this.$swal.fire(
            "Error!",
            `Error updating  ${this.resource.name}:`,
            "error"
          );
        })
        .finally(() => {
          this.actionLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.validation-error {
  color: red;
}

.me {
  width: 0px;
  height: 0px;
  visibility: hidden;
}

.file-preview {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.file-preview img,
.file-preview video {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.file-preview audio {
  width: 100%;
}

.file-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
</style>
