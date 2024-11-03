<template>
    <div class="mb-4">
      <label v-if="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ title }}
      </label>
      <div v-for="(item, index) in internalValue" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Item {{ index + 1 }}</h3>
          <button
            @click="removeItem(index)"
            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Remove Item
          </button>
        </div>
        <ObjectInput
          :name="`${name}[${index}]`"
          :value="item"
          :fields="fields"
          :initialData="{}"
          @update:value="updateItem(index, $event)"
        />
      </div>
      <button
        @click="addItem"
        class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add New Item
      </button>
    </div>
  </template>
  
  <script>
  import ObjectInput from './ObjectInput.vue';
  
  export default {
    name: 'ObjectArrayInput',
    components: {
      ObjectInput,
    },
    props: {
      name: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        default: '',
      },
      value: {
        type: Array,
        required: true,
      },
      fields: {
        type: Array,
        required: true,
      },
      initialData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        internalValue: this.value,
      };
    },
    watch: {
      value: {
        handler(newValue) {
          this.internalValue = newValue;
        },
        deep: true,
      },
    },
    methods: {
      updateItem(index, newValue) {
        const updatedArray = [...this.internalValue];
        updatedArray[index] = newValue;
        this.internalValue = updatedArray;
        this.$emit('update:value', this.internalValue);
      },
      addItem() {
        const newItem = this.fields.reduce((acc, field) => {
          acc[field.name] = field.default !== undefined ? field.default : null;
          return acc;
        }, {});
        this.internalValue.push(newItem);
        this.$emit('update:value', this.internalValue);
      },
      removeItem(index) {
        this.internalValue.splice(index, 1);
        this.$emit('update:value', this.internalValue);
      },
    },
  };
  </script>