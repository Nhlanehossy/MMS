<template>
  <div :class="classes">
    <div v-if="$slots.header" class="">
      <slot name="header" />
    </div>
    <div class="card-body bg-webBackground text-webSecondary">
      <slot />
    </div>
    <div v-if="$slots.footer" class="">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UICard',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => {
        return [
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
          'light',
          'dark',
        ].includes(value);
      },
    },
    outline: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      let baseClasses = 'card border rounded-lg w-80'; 
      let variantClasses = '';
      let shadowClasses = this.shadow? "shadow-md":"";

      if (this.outline) {
        switch (this.variant) {
          case 'primary':
            variantClasses = 'border-webPrimary text-webPrimary';
            break;
          case 'secondary':
            variantClasses = 'border-webSecondary text-webSecondary';
            break;
          case 'success':
            variantClasses = 'border-green-600 text-green-600';
            break;
          case 'danger':
            variantClasses = 'border-red-600 text-red-600';
            break;
          case 'warning':
            variantClasses = 'border-yellow-600 text-yellow-600';
            break;
          case 'info':
            variantClasses = 'border-webPrimary text-webPrimary';
            break;
          case 'light':
            variantClasses = 'border-gray-300 text-gray-700';
            break;
          case 'dark':
            variantClasses = 'border-webBackgroundDark text-white';
            break;
        }
      } else {
        switch (this.variant) {
          case 'primary':
            variantClasses = 'bg-webPrimary text-white';
            break;
          case 'secondary':
            variantClasses = 'bg-webSecondary text-white';
            break;
          case 'success':
            variantClasses = 'bg-green-600 text-white';
            break;
          case 'danger':
            variantClasses = 'bg-red-600 text-white';
            break;
          case 'warning':
            variantClasses = 'bg-yellow-600 text-white';
            break;
          case 'info':
            variantClasses = 'bg-webPrimary text-white';
            break;
          case 'light':
            variantClasses = 'bg-gray-300 text-gray-700';
            break;
          case 'dark':
            variantClasses = 'bg-webBackgroundDark text-white';
            break;
        }
      }

      return [baseClasses, variantClasses, shadowClasses];
    },
  },
};
</script>