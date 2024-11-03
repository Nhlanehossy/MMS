<template>
  <div class="mb-4">
    <a-form-item :label="title" :name="name">
      <a-upload
        :accept="acceptTypes"
        :multiple="isArrayType"
        :fileList="antdFiles"
        :beforeUpload="beforeUpload"
        :showUploadList="false"
        :customRequest="handleCustomRequest"
        @remove="handleRemove"
        :onChange="handleChange"
        class="upload-wrapper"
      >
        <a-button icon="upload">
          {{ translationKeys.Browse }}
        </a-button>
      </a-upload>
      
      <a-button 
        v-if="files.length && !isUploading" 
        type="primary" 
        @click="uploadFiles"
        class="mt-4"
      >
        Upload to Firebase
      </a-button>

      <a-progress 
        v-if="isUploading" 
        :percent="uploadProgress" 
        status="active" 
        class="mt-4"
      />

      <a-row :gutter="[16, 16]" class="mt-4">
        <a-col :span="12" :sm="8" :md="6" v-for="(file, index) in displayFiles" :key="index">
          <a-card hoverable class="h-full">
            <template #cover>
              <a-spin :spinning="!file.previewLoaded">
                <img v-if="isImage(file)"
                     :src="getPreviewUrl(file)"
                     alt="Preview" 
                     class="w-full h-32 object-cover"
                     @load="file.previewLoaded = true"
                     @error="file.previewLoaded = true" />
                <video v-else-if="isVideo(file)" :src="getPreviewUrl(file)" controls class="w-full h-32 object-cover"></video>
                <audio v-else-if="isAudio(file)" :src="getPreviewUrl(file)" controls class="w-full mt-2"></audio>
                <div v-else class="w-full h-32 flex items-center justify-center p-2 text-center break-words">
                  {{ file.name }}
                </div>
              </a-spin>
            </template>
            <template #actions>
              <a-button type="danger" shape="circle" icon="delete" @click="removeFile(index)" />
            </template>
          </a-card>
        </a-col>
      </a-row>
    </a-form-item>
  </div>
</template>

<script>
import { translationKeys } from '@/executables/translation';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { message } from 'ant-design-vue';

export default {
  name: 'FileInput',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['image', 'video', 'audio', 'document', 'image array', 'video array', 'audio array', 'document array'].includes(value)
    },
    initialData: {
      type: [String, File, Array],
      default: null
    }
  },
  data() {
    return {
      files: [],
      initialFiles: [],
      translationKeys: translationKeys,
      isUploading: false,
      uploadProgress: 0,
    };
  },
  computed: {
    isArrayType() {
      return this.type.includes('array');
    },
    acceptTypes() {
      switch (this.type.replace(' array', '')) {
        case 'image':
          return 'image/*';
        case 'video':
          return 'video/*';
        case 'audio':
          return 'audio/*';
        case 'document':
          return '.doc,.docx,.pdf,.txt';
        default:
          return '';
      }
    },
    antdFiles() {
      return this.files.map((file, index) => ({
        uid: -index,
        name: file.name,
        status: 'done',
        url: file.url,
      }));
    },
    displayFiles() {
      return [...this.initialFiles, ...this.files];
    }
  },
  mounted() {
    this.initializeFiles();
  },
  methods: {
    initializeFiles() {
      if (this.initialData) {
        if (Array.isArray(this.initialData)) {
          this.initialFiles = this.initialData.map(url => ({
            name: this.getFileNameFromUrl(url),
            url: url,
            previewLoaded: false
          }));
        } else if (typeof this.initialData === 'string') {
          this.initialFiles = [{
            name: this.getFileNameFromUrl(this.initialData),
            url: this.initialData,
            previewLoaded: false
          }];
        }
      }
    },
    getFileNameFromUrl(url) {
      return url.split('/').pop();
    },
    beforeUpload(file) {
      const localFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        originalFile: file,
        previewLoaded: false
      };
      
      if (this.isArrayType) {
        this.files.push(localFile);
      } else {
        this.files = [localFile];
      }
      
      return false;
    },
    async uploadFiles() {
      this.isUploading = true;
      this.uploadProgress = 0;
      
      const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
      let uploadedSize = 0;

      try {
        const uploadedFiles = await Promise.all(this.files.map(async file => {
          const uploadedFile = await this.uploadToFirebase(file.originalFile, (progress) => {
            uploadedSize += progress;
            this.uploadProgress = Math.round((uploadedSize / totalSize) * 100);
          });
          return { ...file, ...uploadedFile };
        }));
        
        this.files = uploadedFiles;
        const uploadedUrls = this.files.map(f => f.url);
        const allUrls = [...this.initialFiles.map(f => f.url), ...uploadedUrls];
        this.$emit('update:value', this.isArrayType ? allUrls : allUrls[allUrls.length - 1]);

        console.log('Uploaded Firebase URLs:', uploadedUrls);
        message.success(`Successfully uploaded ${this.files.length} file${this.files.length > 1 ? 's' : ''} to Firebase`);
      } catch (error) {
        console.error('Error uploading file:', error);
        message.error('Failed to upload file(s). Please try again.');
      } finally {
        this.isUploading = false;
        this.uploadProgress = 100;
      }
    },
    async uploadToFirebase(file, onProgress) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`${this.type.replace(' array', '')}/${file.name}`);
      
      const uploadTask = fileRef.put(file);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      }, (error) => {
        console.error('Upload error:', error);
        message.error('Upload failed. Please try again.');
      });

      return new Promise((resolve, reject) => {
        uploadTask.then(() => {
          fileRef.getDownloadURL().then((url) => {
            resolve({ url });
          }).catch(reject);
        }).catch(reject);
      });
    },
    removeFile(index) {
      this.files.splice(index, 1);
      this.$emit('update:value', this.isArrayType ? this.files.map(f => f.url) : null);
    },
    handleCustomRequest({ file, onSuccess, onError }) {
      this.beforeUpload(file);
      // Simulate a successful upload
      setTimeout(() => {
        onSuccess(file);
      }, 1000);
    },
    handleChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    isImage(file) {
      return file.type.startsWith('image/') || (file.name && file.name.match(/\.(jpg|jpeg|png|gif)$/i));
    },
    isVideo(file) {
      return file.type.startsWith('video/') || (file.name && file.name.match(/\.(mp4|webm|ogg)$/i));
    },
    isAudio(file) {
      return file.type.startsWith('audio/') || (file.name && file.name.match(/\.(mp3|wav|ogg)$/i));
    },
    getPreviewUrl(file) {
      return file.url || (file.originalFile && URL.createObjectURL(file.originalFile));
    },
  }
};
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  align-items: center;
}
</style>
