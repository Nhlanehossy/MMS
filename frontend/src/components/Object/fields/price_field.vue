<template>
  <div class="price-display">
    <label :for="name">{{ title }}</label>
    <div class="display-wrapper">
      <span class="amount-display">{{ formattedAmount }}</span>
      <span class="currency-display">{{ selectedCurrency }}</span>
    </div>

    <div v-if="showConversion" class="conversion-info">
      <div v-if="isLoading">Converting...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="conversions">
        <div v-for="(rate, currency) in conversions" :key="currency" class="conversion-rate">
          {{ currency }}: {{ rate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import axios from 'axios';

const currencies = [
  { code: 'MWK', symbol: 'MK' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CHF', symbol: 'Fr' },
  { code: 'CNY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
  { code: 'BRL', symbol: 'R$' },
];

export default {
  name: 'PriceDisplay',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
      // Expected format: { amount: number, currency: string }
    },
    showConversion: {
      type: Boolean,
      default: true,
    },
    convertTo: {
      type: Array,
      default: () => ['MWK', 'USD', 'EUR', 'GBP'],
    },
  },

  setup(props) {
    const amount = ref(props.value.$numberDecimal || 0);
    const selectedCurrency = ref(props.value.currency || 'MWK');
    const conversions = ref({});
    const isLoading = ref(false);
    const error = ref(null);

    const formattedAmount = ref('');

    // Function to format amount with 2 decimal points for display
    const formatAmount = (value) => {
      return value ? parseFloat(value).toFixed(2) : '0.00';
    };

    // Update formatted amount when the amount changes
    watch(amount, (newAmount) => {
      formattedAmount.value = formatAmount(newAmount);
    });

    // Watch for external value changes
    watch(
      () => props.value,
      (newValue) => {
        if (newValue) {
          amount.value = newValue.amount;
          selectedCurrency.value = newValue.currency;
          formattedAmount.value = formatAmount(newValue.amount);
        }
      },
      { deep: true }
    );

    async function fetchConversionRates() {
      if (!amount.value) {
        conversions.value = {};
        return;
      }

      try {
        isLoading.value = true;
        error.value = null;

        // Using Exchange Rate API (Free tier)
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${selectedCurrency.value}`
        );

        const rates = response.data.rates;
        const newConversions = {};

        props.convertTo.forEach(currency => {
          if (currency !== selectedCurrency.value) {
            const convertedAmount = amount.value * rates[currency];
            newConversions[currency] = convertedAmount.toFixed(2);
          }
        });

        conversions.value = newConversions;
      } catch (err) {
        error.value = 'Failed to fetch conversion rates';
        console.error('Conversion error:', err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      formattedAmount,
      selectedCurrency,
      conversions,
      isLoading,
      error,
    };
  },
};
</script>

<style scoped>
.price-display {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.display-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.amount-display {
  font-size: 18px;
  font-weight: bold;
}

.currency-display {
  font-size: 16px;
  color: #666;
}

.conversion-info {
  margin-top: 10px;
  font-size: 14px;
}

.conversions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.conversion-rate {
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.error {
  color: #dc3545;
}
</style>
