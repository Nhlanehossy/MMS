<template>
  <LoaderAlt v-if="loading" />
  <div v-else class="bg-background min-h-screen flex items-center justify-center">
    <div class="bg-cardLight p-8 rounded-lg shadow-md max-w-md mx-auto">
      <div class="flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-center mb-4">Purchase Done Successfully</h1>
      <div class="mb-6">
        <img :src="payment.image" alt="" class="mx-auto max-w-full h-auto rounded-md shadow-md" />
      </div>
      <ul class="text-text">
        <li class="mb-2">
          <span class="font-bold">Item Name:</span> {{ payment.name }}
        </li>
        <li class="mb-2">
          <span class="font-bold">Amount:</span> MWK{{ payment.amount }}
        </li>

      </ul>
      <div class="mt-8 flex items-center text-center">
        <RouterLink to="/dashboard/farmer/marketplace"
          class="bg-secondary hover:bg-tertiary mr-3 text-white font-bold px-4 rounded transition-colors duration-300"
        >
          Continue To Homr Page
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import LoaderAlt from "../components/LoaderAlt.vue";
import axios from "axios"; // Import axios

export default {
  data() {
    return {
      loading: false,
      payment: {},
    };
  },
  components: { LoaderAlt },
  mounted() {
    const { farmer, product, amount, status, name, image } = this.$route.query;
    this.payment = {
      farmer: farmer,
      product: product,
      amount: amount,
      status: status,
      image: image,
      name: name,
    };
    this.addPayment();
  },
  methods: {
    addPayment() {
      this.loading = true;
      axios
        .post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/payments`,
          this.payment
        )
        .then(() => {
          console.log("Payment added successfully");
        })
        .catch((error) => {
          console.error(`Error adding payment:`, error.message);
          this.$swal.fire("Error!", `Error adding payment: ${error.message}`, "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
