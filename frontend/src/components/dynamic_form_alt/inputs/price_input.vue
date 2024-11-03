<template>
  <div class="price-input">
    <label :for="name">{{ title }}</label>
    <div class="input-wrapper">
      <a-input-number
        :id="name"
        :value="value.amount" 
        @input="updatePriceAmount"
        :placeholder="`Enter ${title}...`"
        class="modern-input"
        :step="0.01"
        :min="0"
      />
      <a-select
        :value="value.currency" 
        @change="updatePriceCurrency"
        class="currency-select"
        :options="currencyOptions"
      />
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
import axios from 'axios';
import { InputNumber, Select } from 'ant-design-vue';

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
  name: 'PriceInput',
  components: {
    'a-input-number': InputNumber,
    'a-select': Select,
  },
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

  emits: ['update:value'],

  methods: {
    async fetchConversionRates(amount, currency) {
      if (!amount) {
        return {};
      }

      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${currency}`
        );

        const rates = response.data.rates;
        const newConversions = {};

        this.convertTo.forEach(curr => {
          if (curr !== currency) {
            const convertedAmount = amount * rates[curr];
            newConversions[curr] = convertedAmount.toFixed(2);
          }
        });

        return newConversions;
      } catch (err) {
        this.error = 'Failed to fetch conversion rates';
        console.error('Conversion error:', err);
        return {};
      }
    },

    async updatePriceAmount(amount) {
      const newAmount = parseFloat(amount) || 0;
      const newCurrency = this.value.currency;

      this.$emit('update:value', {
        amount: newAmount,
        currency: newCurrency,
      });

      // Fetch conversion rates only if there is an amount
      if (newAmount) {
        this.conversions = await this.fetchConversionRates(newAmount, newCurrency);
      }
    },

    updatePriceCurrency(currency) {
      const newAmount = this.value.amount;

      this.$emit('update:value', {
        amount: newAmount,
        currency: currency,
      });

      // Fetch conversion rates if there is an amount
      if (newAmount) {
        this.fetchConversionRates(newAmount, currency).then(rates => {
          this.conversions = rates;
        });
      }
    }
  },

  data() {
    return {
      conversions: {},
      isLoading: false,
      error: null,
      currencyOptions: currencies.map(currency => ({
        label: `${currency.code} - ${currency.symbol}`,
        value: currency.code,
      })),
    };
  },
};
</script>

<style scoped>
.price-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.modern-input {
  flex: 1;
}

.currency-select {
  min-width: 120px;
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
