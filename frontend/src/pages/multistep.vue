<template>
    <div>
      <DynamicForm 
        :schema="formSchema" 
        :initialData="initialFormData"
        :steps="formSteps"
        @submit="handleFormSubmit"
      />
    </div>
  </template>
  
  <script>
  import * as Yup from 'yup';
  import multi_step_form from '../components/dynamic_form_alt/multi_step_form.vue';
  
  export default {
    components: {
      DynamicForm: multi_step_form
    },
    data() {
      return {
        formSchema: [
          {
            name: 'firstName',
            type: 'text',
            label: 'First Name',
            validation: Yup.string().required('First name is required') // Yup validation
          },
          {
            name: 'lastName',
            type: 'text',
            label: 'Last Name',
            validation: Yup.string().required('Last name is required') // Yup validation
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            validation: Yup.string().email('Invalid email format').required('Email is required') // Yup validation
          },
          {
            name: 'phone',
            type: 'tel',
            label: 'Phone Number',
            validation: Yup.string()
              .matches(/^\d{10}$/, 'Phone number must be 10 digits')
              .required('Phone number is required') // Yup validation
          },
          {
            name: 'birthDate',
            type: 'date',
            label: 'Date of Birth',
            validation: Yup.date().required('Date of Birth is required') // Yup validation
          },
          {
            name: 'occupation',
            type: 'text',
            label: 'Occupation',
            validation: Yup.string() // Optional field, no required validation
          },
          {
            name: 'interests',
            type: 'tags',
            label: 'Interests',
            validation: Yup.array() // Optional field, no required validation
          },
          {
            name: 'bio',
            type: 'textarea',
            label: 'Bio',
            validation: Yup.string() // Optional field, no required validation
          },
          {
            name: 'password',
            type: 'password',
            label: 'Password',
            validation: Yup.string()
              .min(8, 'Password must be at least 8 characters')
              .required('Password is required') // Yup validation
          },
          {
            name: 'confirmPassword',
            type: 'password',
            label: 'Confirm Password',
            validation: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords do not match')
              .required('Confirm Password is required') // Yup validation
          },
          {
            name: 'agreeTerms',
            type: 'checkbox',
            label: 'I agree to the terms and conditions',
            validation: Yup.boolean()
              .oneOf([true], 'You must agree to the terms and conditions') // Yup validation
          }
        ],
        initialFormData: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthDate: '',
          occupation: '',
          interests: [],
          bio: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        },
        formSteps: [
          { name: 'Personal Information', fields: ['firstName', 'lastName', 'email'] },
          { name: 'Additional Details', fields: ['phone', 'birthDate', 'occupation'] },
          { name: 'Interests & Bio', fields: ['interests', 'bio'] },
          { name: 'Account Setup', fields: ['password', 'confirmPassword', 'agreeTerms'] }
        ]
      };
    },
    methods: {
      handleFormSubmit(formData) {
        console.log('Form submitted:', formData);
        alert('Form submitted successfully!');
      }
    }
  }
  </script>
  
