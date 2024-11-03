<template>
    <SharedModal title="Add New Task" @close="$emit('close')">
      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <div class="form-group">
          <label for="title">Title</label>
          <Field name="title" v-model="newTask.title" />
          <span class="error">{{ errors.title }}</span>
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <Field name="description" v-model="newTask.description" as="textarea" />
          <span class="error">{{ errors.description }}</span>
        </div>
        
        <div class="form-group">
          <label>Subtasks</label>
          <div v-for="(subtask, index) in newTask.subtasks" :key="index">
            <Field :name="`subtasks[${index}].text`" v-model="subtask.text" />
            <button type="button" @click="removeSubtask(index)">Remove</button>
          </div>
          <button type="button" @click="addSubtask">Add Subtask</button>
        </div>
        
        <div class="form-group">
          <label>Assign to</label>
          <multiselect
            v-model="newTask.assignedTo"
            :options="users"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          ></multiselect>
          <span class="error">{{ errors.assignedTo }}</span>
        </div>
        
        <div class="modal-actions">
          <button type="submit">Add Task</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>
      </Form>
    </SharedModal>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { Form, Field } from 'vee-validate';
  import * as yup from 'yup';
  import { mapGetters } from 'vuex';
  import SharedModal from './shared_modal.vue';
  import Multiselect from 'vue-multiselect';
  
  export default {
    components: {
      Form,
      Field,
      SharedModal,
      Multiselect
    },
    setup(props, { emit }) {
      const newTask = ref({
        title: '',
        description: '',
        subtasks: [],
        assignedTo: []
      });
  
      const schema = yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string().required('Description is required'),
        assignedTo: yup.array().min(1, 'Assign to at least one user')
      });
  
      const onSubmit = (values) => {
        emit('add-task', values);
      };
  
      return { newTask, schema, onSubmit };
    },
    computed: {
      ...mapGetters('kanban', ['getUsers']),
      users() {
        return this.getUsers;
      }
    },
    methods: {
      addSubtask() {
        this.newTask.subtasks.push({ text: '', done: false });
      },
      removeSubtask(index) {
        this.newTask.subtasks.splice(index, 1);
      },
      addTag(newTag) {
        const tag = {
          name: newTag,
          code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
        };
        this.users.push(tag);
        this.newTask.assignedTo.push(tag);
      }
    }
  };
  </script>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>
  
  <style scoped>
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
  }
  
  .error {
    color: #ef4444;
    font-size: 0.875rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  button[type="button"] {
    background-color: #6b7280;
  }
  
  button[type="button"]:hover {
    background-color: #2563eb;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  </style>