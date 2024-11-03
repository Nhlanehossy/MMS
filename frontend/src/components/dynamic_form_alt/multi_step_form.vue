

<template>
  <div class="dynamic-form-container">
    <div class="dynamic-form">
      <form @submit.prevent="handleSubmit">
        <template v-if="mode === 'multistep'">
          <StepIndicators :steps="stepsWithConfirmation" :currentStep="currentStep" @goToStep="goToStep"
            class="step-indicators" />
        </template>
        <template v-else-if="mode === 'tabbed'">
          <TabIndicators :tabs="defaultSteps" :currentTab="currentStep" @changeTab="changeTab" />
        </template>

        <transition name="fade" mode="out-in">
          <div class="form-content" :key="currentStep">
            <template v-if="mode === 'default' || currentStep < stepsWithConfirmation.length">
              <div class="flex justify-content-center">
                <FormGrid 
                  :currentFields="mode === 'default' ? schema : currentFields" 
                  :formData="formData"
                  :validationErrors="validationErrors" 
                  :initialData="initialData" 
                  :schema="schema"
                  @update:formData="updateFormData" 
                  @validateField="validateField"
                  @password-valid="handlePasswordValid" 
                />
              </div>
            </template>
            <template v-else-if="mode !== 'default' && currentStep === stepsWithConfirmation.length">
              <ConfirmationStep :formData="formData" :schema="schema" />
            </template>
          </div>
        </transition>
      </form>
      <template v-if="mode !== 'default'">
        <StepNavigation 
          :steps="stepsWithConfirmation" 
          :currentStep="currentStep" 
          @prevStep="prevStep"
          @nextStep="nextStep" 
          @finish="handleSubmit" 
          class="step-navigation" 
        />
      </template>
      <template v-else>
        <button @click="handleSubmit" class="bg-primary py-2 px-3 ml-5">Submit</button>
      </template>
    </div>
  </div>
</template>

<script>
import StepIndicators from './step_indicators.vue';
import TabIndicators from './tab_indicators.vue';
import FormGrid from './form_grid.vue';
import StepNavigation from './step_navigation.vue';
import ConfirmationStep from './confirmation_step.vue';
import * as Yup from 'yup';

export default {
  name: 'DynamicForm',
  components: {
    StepIndicators,
    TabIndicators,
    FormGrid,
    StepNavigation,
    ConfirmationStep,
  },
  props: {
    schema: {
      type: Array,
      required: true
    },
    initialData: {
      type: Object,
      default: () => ({})
    },
    steps: {
      type: Array,
      required: false,
      default: () => []
    },
    mode: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'multistep', 'tabbed'].includes(value)
    }
  },
  data() {
    return {
      formData: this.createFormData(),
      validationErrors: this.schema.reduce((errors, field) => {
        errors[field.name] = '';
        return errors;
      }, {}),
      currentStep: 0,
      isCurrentStepValid: true,
    };
  },
  mounted(){
    console.log(this.mode)
  },
  computed: {
    currentFields() {
      if (this.mode === 'default') {
        return this.schema;
      } else {
        const currentStep = this.stepsWithConfirmation[this.currentStep];
        return this.schema.filter((field) => currentStep.fields.includes(field.name));
      }
    },
    validationSchema() {
      const schemaShape = {};
      this.schema.forEach(field => {
        if (field.validation) {
          schemaShape[field.name] = field.validation;
        }
      });
      return Yup.object().shape(schemaShape);
    },
    defaultSteps() {
      if (this.steps && this.steps.length > 0) {
        return this.steps;
      }

      const defaultSteps = [];
      let currentStepFields = [];

      const isolatedTypes = ['email', 'password', 'image', 'video', 'audio', 'document', 'richtext'];
      this.schema.forEach(field => {
        const isIsolatedField = isolatedTypes.includes(field.type) ||
          field.type.endsWith('[]') ||
          ['image', 'video', 'audio', 'document'].some(type => field.type.startsWith(type));

        if (isIsolatedField) {
          if (currentStepFields.length > 0) {
            defaultSteps.push({
              name: `Step ${defaultSteps.length + 1}`,
              fields: currentStepFields
            });
            currentStepFields = [];
          }
          defaultSteps.push({
            name: `${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Step`,
            fields: [field.name]
          });
        } else {
          currentStepFields.push(field.name);
          if (field.type === 'richtext' || this.isFileType(field.type)) {
            defaultSteps.push({
              name: `Step ${defaultSteps.length + 1}`,
              fields: [...currentStepFields, field.name]
            });
            currentStepFields = [];
          } else if (currentStepFields.length === 3) {
            defaultSteps.push({
              name: `Step ${defaultSteps.length + 1}`,
              fields: currentStepFields
            });
            currentStepFields = [];
          }
        }
      });

      if (currentStepFields.length > 0) {
        defaultSteps.push({
          name: `Step ${defaultSteps.length + 1}`,
          fields: currentStepFields
        });
      }

      return defaultSteps;
    },
    stepsWithConfirmation() {
      if (this.mode === 'default') {
        return [{ name: 'All Fields', fields: this.schema.map(field => field.name) }];
      }
      return this.defaultSteps;
    },
  },
  methods: {
    createFormData() {
      const data = {};
      this.schema.forEach((field) => {
        if (field.type === 'object') {
          data[field.name] = this.createNestedObject(
            field.fields,
            this.initialData[field.name] || {}
          );
        } else if (field.type === 'objects') {
          data[field.name] = this.createNestedObjectArray(
            field.fields,
            this.initialData[field.name] || []
          );
        } else {
          data[field.name] =
            this.initialData[field.name] !== undefined
              ? this.initialData[field.name]
              : field.initialData || this.getDefaultValue(field.type);
        }
      });
      return data;
    },
    createNestedObject(fields, initialData) {
      const data = {};
      fields.forEach((field) => {
        data[field.name] =
          initialData[field.name] !== undefined
            ? initialData[field.name]
            : field.initialData || this.getDefaultValue(field.type);
      });
      return data;
    },
    createNestedObjectArray(fields, initialData) {
      return initialData.map((item) => {
        const data = {};
        fields.forEach((field) => {
          data[field.name] =
            item[field.name] !== undefined
              ? item[field.name]
              : field.initialData || this.getDefaultValue(field.type);
        });
        return data;
      });
    },
    getDefaultValue(type) {
      switch (type) {
        case 'text':
        case 'tel':
        case 'email':
        case 'password':
        case 'textarea':
        case 'color':
        case 'time':
        case 'date':
        case 'ref':
        case 'radio':
        case 'select':
        case 'file':
          return '';
        case 'number':
          return 0;
        case 'checkbox':
          return false;
        case 'tags':
          return [];
        default:
          return '';
      }
    },
    updateFormData({ name, value }) {
      this.formData = { ...this.formData, [name]: value };
      this.validateField(name);
    },
    validateField(name) {
      const field = this.schema.find((field) => field.name === name);
      if (field && field.validation) {
        try {
          field.validation.validateSync(this.formData[name]);
          delete this.validationErrors[name];
        } catch (error) {
          this.validationErrors[name] = error.message;
        }
      }
    },
    validateForm() {
      this.schema.forEach((field) => {
        if (field.validation) {
          this.validateField(field.name);
        }
      });
    },
    handleSubmit() {
      this.validateForm();
      if (Object.keys(this.validationErrors).length === 0) {
        console.log('Form Submitted', this.formData);
        this.$emit('submit', this.formData);
      } else {
        console.log('Form has validation errors', this.validationErrors);
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    nextStep() {
      if (this.currentStep < this.stepsWithConfirmation.length - 1) {
        this.validateCurrentStep();
        if (this.isCurrentStepValid) {
          this.currentStep++;
        }
      }
    },
    changeTab(index) {
      this.currentStep = index;
    },
    goToStep(index) {
      this.currentStep = index;
    },
    validateCurrentStep() {
      this.isCurrentStepValid = true;
      const currentStep = this.stepsWithConfirmation[this.currentStep];
      const fieldsInCurrentStep = this.schema.filter((field) =>
        currentStep.fields.includes(field.name)
      );
      fieldsInCurrentStep.forEach((field) => {
        if (field.validation) {
          this.validateField(field.name);
          if (this.validationErrors[field.name]) {
            this.isCurrentStepValid = false;
          }
        }
      });
    },
    handlePasswordValid() {
      if (this.mode !== 'default') {
        this.nextStep();
      }
    },
    isFileType(type) {
      return ['image', 'video', 'audio', 'document'].some(fileType =>
        type === fileType || type === `${fileType} array` || type.startsWith(fileType)
      );
    },
  }
};
</script>

<style scoped>
.dynamic-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

.dynamic-form {
  background-color: var(--webBackground);
  width: 100%;
  max-width: 800px;

  box-sizing: border-box;
}

.form-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}


@media (max-width: 768px) {
  .dynamic-form-container {
    align-items: flex-start;
    padding: 0;
  }

  .dynamic-form {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .form-content {
    padding: 10px;
    flex-grow: 1;
    overflow-y: auto;
  }

  .step-navigation {
    margin-top: auto;
    padding-top: 15px;
  }
}
</style>
