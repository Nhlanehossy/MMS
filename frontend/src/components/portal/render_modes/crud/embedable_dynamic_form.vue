<template>
  <div>
    <form @submit.prevent="submitForm" class="flex items-center dynamic-form">
      <div class="flex items-center">
        <div v-for="field in resource.schema" :key="field.name" class="">

          <div class="basis-32 min-w-[8rem]" v-if="field.type === 'text' || field.type === 'richtext'">
            <label>{{ field.title }}</label>
            <div id="app" v-if="field.type === 'richtext'">
              <QuillEditor
                v-model:content="formData[field.name]"
                @update:content="formData[field.name] = $event"
                :required="field.required"
                contentType="html"
                :toolbar="[
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ header: 1 }, { header: 2 }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ script: 'sub' }, { script: 'super' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ direction: 'rtl' }],
                  [{ size: ['small', false, 'large', 'huge'] }],
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ color: [] }, { background: [] }],
                  [{ font: [] }],
                  [{ align: [] }],
                  ['clean']
                ]"
              />
            </div>
            <input v-else
              v-model="formData[field.name]"
              type="text"
              :required="field.required"
            />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'email'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="email" :required="field.required" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'me'">
            <input v-model="formData[field.name]" type="text" :required="field.required" class="h-0 px-0 py-0" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'password'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="password" :required="field.required" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'phone'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="tel" :required="field.required" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'number'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="number" :required="field.required" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'decimal'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="number" step="0.01" :required="field.required" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'date'">
            <label>{{ field.title }}</label>
            <input
              :value="formatIsoDate(formData[field.name])"
              @input="updateDate(field.name, $event.target.value)"
              type="date"
              :required="field.required"
            />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'datetime'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="datetime-local" :required="field.required" />
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'time'">
            <label>{{ field.title }}</label>
            <input v-model="formData[field.name]" type="time" :required="field.required" />
          </div>

          <div class="min-w-[3rem] mr-1" v-else-if="field.type === 'ref'">
            <label>{{ field.title }}</label>
            <select v-model="formData[field.name]" :required="field.required">
              <option v-for="option in refOptions[field.name]" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </div>

          <div class="basis-32 min-w-[8rem]" v-else-if="field.type === 'select'">
            <label>{{ field.title }}</label>
            <select v-model="formData[field.name]" :required="field.required">
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

        </div>
      </div>
      <button class="bg-primary px-4 py-2 rounded-md" type="submit" >Submit</button>
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
import { translationKeys } from '@/executables/translation';
import "firebase/compat/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDUZNzlJpQJpO52-8OSjuveW4HbXLIhB8",
  authDomain: "server-services-50a49.firebaseapp.com",
  projectId: "server-services-50a49",
  storageBucket: "server-services-50a49.appspot.com",
  messagingSenderId: "484734300353",
  appId: "1:484734300353:web:e114a73b06c46823c72440",
  measurementId: "G-SJVFBE0VY0",
};

firebase.initializeApp(firebaseConfig);

export default {
  name: "app",
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
    redirectTo: {
      type: String,
      required: false,
    },
    returnDataOnly: {
      type: Boolean,
      default: false
    }
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
      formData: {},
      showFileInput: {},
      selectedRef: "",
      resolvedTagLabels: {},
      tagLoading: false,
      uploadProgress: {},
    };
  },
  components: { ckeditor: CKEditor.component, QuillEditor, DynamicTable, Loader },
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
  methods: {
    emitFormData() {
      this.$emit('form-data', this.formData);
    },
    async getTagLabel(tagId, resource, fieldName) {
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
      this.tagLoading = true;
      try {
        for (const field of this.resource.schema) {
          if (field.type === "tags" && field.tagInputType === "refs") {
            this.resolvedTagLabels[field.name] = {};
            for (const tagId of this.formData[field.name]) {
              if (!this.resolvedTagLabels[field.name][tagId]) {
                this.resolvedTagLabels[field.name][tagId] = console.log({
                  id: tagId,
                  resource: field.resource,
                  field: field.field,
                });
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
    getFilePreview(fieldName) {
      const file = this.formData[fieldName];
      if (file instanceof File) {
        return URL.createObjectURL(file);
      } else if (typeof file === "string") {
        return file;
      } else {
        return "";
      }
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

    getTagLabel(tagId, fieldName) {
      console.log(this.refOptions, "nde ma ref options");
      const option = this.refOptions[fieldName].find(
        (option) => option.id === tagId
      );
      return option ? option.name : tagId;
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
              case "range":
                this.formData[field.name] = "";
                break;
              case "boolean":
              case "check":
                this.formData[field.name] = false;
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
          } else if (typeof this.formData[field.name] === "undefined") {
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
        }
      }
    },
    addArrayItem(fieldName) {
      const field = this.resource.schema.find((f) => f.name === fieldName);
      const newItem = {};
      for (const subField of field.schema) {
        newItem[subField.name] = "";
      }
      this.formData[fieldName].push(newItem);
    },

    handleFileUpload(field, event) {
      this.formData[field.name] = event.target.files[0];
      this.showFileInput[field.name] = false;
    },
    handleFileUploadArray(field, event) {
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
    async submitForm() {

      if (this.returnDataOnly) {
        // Emit an event with the form data
        this.$emit('form-data', this.formData);
        return;
      }


      const fileFields = this.resource.schema.filter(
        (field) =>
          field.type === "image" ||
          field.type === "video" ||
          field.type === "audio" ||
          field.type === "document" ||
          field.type === "image array" ||
          field.type === "video array" ||
          field.type === "audio array" ||
          field.type === "document array"
      );

      if (fileFields.length > 0) {
        this.isUploading = true;
        this.actionLoading = true;

        try {
          // Handle single file fields
          for (const field of fileFields) {
            if (
              field.type === "image" ||
              field.type === "video" ||
              field.type === "audio" ||
              field.type === "document"
            ) {
              const file = this.formData[field.name];
              if (file instanceof File) {
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`${field.name}/${file.name}`);
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                this.formData[field.name] = downloadURL;
              }
            }
          }

          // Handle file array fields
          for (const field of fileFields) {
            if (
              field.type === "image array" ||
              field.type === "video array" ||
              field.type === "audio array" ||
              field.type === "document array"
            ) {
              const existingFiles = this.formData[field.name] || [];
              const newFiles = [];
              const downloadURLs = [];

              // Separate existing files (URLs) from new files
              for (const file of existingFiles) {
                if (typeof file === "string") {
                  downloadURLs.push(file);
                } else {
                  newFiles.push(file);
                }
              }

              // Upload new files
              for (const file of newFiles) {
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`${field.name}/${file.name}`);
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                downloadURLs.push(downloadURL);
              }

              // Store the download URLs in the same field
              this.formData[field.name] = downloadURLs;
            }
          }
        } catch (error) {
          console.error(`Error uploading file: ${error.message}`);
          this.$swal.fire(
            "Error!",
            `Error uploading file: ${error.message}`,
            "error"
          );
          this.isUploading = false;
          return;
        }

        this.isUploading = false;
        this.actionLoading = false;
      }

      // Form submission logic
      if (this.isAdding) {
        this.add();
      } else {
        this.edit();
      }
    },
    add() {
      const dataToSend = { ...this.formData };

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
          this.$router.push(
            `/dashboard/${this.resource.path}`
          );
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
