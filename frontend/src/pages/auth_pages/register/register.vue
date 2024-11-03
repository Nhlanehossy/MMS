<script setup>
import { ref, reactive } from 'vue';
import * as Yup from 'yup';
import { message, Alert } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import MultiStepForm from '../../../components/dynamic_form_alt/multi_step_form.vue';
import SfLoader from '../../../components/u_i/sf_loader.vue';
import SfLogo from '../../../components/u_i/sf_logo.vue';
import { translationKeys } from '../../../Localization/International/english';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const formData = reactive({});
const alertMessage = ref('');
const alertType = ref('');

const initial = ref({
  role: '66e16a45fe3bd80736e85e4d',
  status: '66e16a11fe3bd80736e85e11',
  isAccountActive: true,
});

const formSchema = [
  {
    name: 'fullname',
    type: 'text',
    title: translationKeys.FullName,
    validation: Yup.string().required('Full name is required')
  },
  {
    name: 'email',
    type: 'email',
    title: translationKeys.Email,
    validation: Yup.string().email('Invalid email format').required('Email is required')
  },
  {
    name: 'password',
    type: 'password',
    title: translationKeys.Password,
    validation: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
  },
  {
    name: 'phoneNumber',
    type: 'tel',
    title: translationKeys.PhoneNumber,
    validation: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required')
  },
  {
    name: 'dateOfBirth',
    type: 'date',
    title: translationKeys.DateOfBirth,
    validation: Yup.date().required('Date of Birth is required')
  },
  {
    name: "gender",
    title: "Gender",
    type: "ref",
    resource: "genders",
    field: "gender",
    validation: Yup.string().required('Gender is required')
  },
  {
    name: 'image',
    type: 'image',
    title: translationKeys.ProfilePicture,
    validation: Yup.string().required('Profile picture is required')
  },
  {
    name: 'agreeTerms',
    type: 'checkbox',
    title: 'I agree to the terms and conditions',
    validation: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  }
];



const formSteps = [
  {
    image: 'https://freewebillustrations.com/static/images/preview/drawkit-reading-corner-colour.png',
    name: 'Please Enter Your Name',
    description: 'Enter your full name',
    fields: ['fullname']
  },
  {
    image: 'https://freewebillustrations.com/static/images/preview/delesign-free-designs-email.png',
    name: 'Please Enter Your Email',
    description: 'Enter your email address',
    fields: ['email']
  },
  {
    image: 'https://freewebillustrations.com/static/images/preview/ouch-kingdom-sign-in.png',
    name: 'Please Create a Strong Password',
    description: 'Create a strong password',
    fields: ['password', 'confirmPassword']
  },
  {
    image: 'https://freewebillustrations.com/static/images/preview/illustrations-gallery-mobile-phone.png',
    name: 'Please Enter Your Phone Number',
    description: 'Enter your phone number',
    fields: ['phoneNumber']
  },
  {
    image: 'https://freewebillustrations.com/static/images/preview/delesign-free-designs-contact-us.png',
    name: 'Please Enter Your Date of Birth and Gender',
    description: 'Enter your date of birth and gender',
    fields: ['dateOfBirth', 'gender']
  },
  {
    image: '',
    name: 'Profile Picture',
    description: 'Upload your profile picture',
    fields: ['image']
  },
  {
    image: 'https://freewebillustrations.com/static/images/preview/illustrations-gallery-lawyer.png',
    name: 'Terms and Conditions',
    description: 'Accept the terms and conditions',
    fields: ['agreeTerms']
  }
];

async function handleFormValidation(data) {
  const schema = Yup.object().shape({
    fullname: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    image: Yup.string().required('Profile picture is required'),
    agreeTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  });

  try {
    await schema.validate(data, { abortEarly: false });
    return true;
  } catch (error) {
    console.error('Validation errors:', error.errors);
    return false;
  }
}

async function handleRegister(data) {
  // First validate the form data
  const isValid = await handleFormValidation(data);
  if (!isValid) {
    message.error('Please check all form fields and try again.');
    return;
  }

  // Merge form data with initial values
  const formDataWithInitial = {
    ...data,
    ...initial.value
  };

  console.log('Form data with initial values:', formDataWithInitial);
  loading.value = true;
  alertMessage.value = '';
  alertType.value = '';

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/users/register`,
      formDataWithInitial,  // Send directly as JSON
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Show success message using Ant Design
    message.success('Registration successful! Redirecting to login...');
    alertMessage.value = 'Registration successful! Redirecting to login...';
    alertType.value = 'success';
    console.log('Registration successful:', response.data);

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    // Show error message using Ant Design
    const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
    message.error(errorMsg);
    alertMessage.value = errorMsg;
    alertType.value = 'error';
    console.error('Error adding user:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
      <!-- Left side: Content & Illustration container -->
      <div class="hidden md:block md:w-1/2">
        <!-- SF Logo -->
        <SfLogo />

        <!-- Welcome Content -->
        <div class="mb-8">
          <p class="text-lg text-gray-600 mb-4">Register To Get Started</p>

          <!-- Login Option -->
          <p class="text-sm text-gray-600">
            Already have an account?
            <a href="/login" class="text-primary-600 hover:text-primary font-medium">
              Sign in here
            </a>
          </p>
        </div>

        <!-- Original Illustration -->
        <img src="./Eco shopping-pana.svg" alt="Registration illustration" class="w-full max-w-md mx-auto" />
      </div>

      <!-- Right side: Form container -->
      <div class="w-full md:w-1/2 p-2 flex flex-col justify-center">
        <!-- Alert Messages -->
        <a-alert v-if="alertMessage && alertType === 'success'" message="Success" :description="alertMessage"
          type="success" show-icon class="mb-4" />
        <a-alert v-if="alertMessage && alertType === 'error'" message="Error" :description="alertMessage" type="error"
          show-icon class="mb-4" />

        <!-- Loader -->
        <SfLoader v-if="loading" />

        <!-- Form -->
        <MultiStepForm v-else :schema="formSchema" :steps="formSteps" :initial-data="initial" mode="multistep"
          @submit="handleRegister" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary-600 {
  color: #2563eb;
}

.text-primary-600:hover {
  color: #1d4ed8;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .min-h-screen {
    min-height: auto;
  }
}
</style>