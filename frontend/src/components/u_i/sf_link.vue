<template>
    <component
      :is="isRouterLink ? 'router-link' : 'a'"
      :to="to"
      :href="isRouterLink ? undefined : to"
      :class="classes"
      :target="target"
      :rel="rel"
      @click.prevent="handleClick"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot />
    </component>
  </template>
  
  <script>
  export default {
    name: 'AppLink',
    props: {
      to: {
        type: [String, Object],
        required: true,
      },
      variant: {
        type: String,
        default: 'primary',
        validator: (value) => [
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
          'light',
          'dark',
        ].includes(value),
      },
      size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
      },
      outline: {
        type: Boolean,
        default: false,
      },
      underline: {
        type: Boolean,
        default: false,
      },
      target: {
        type: String,
        default: null,
        validator: (value) => ['_blank', '_self', '_parent', '_top'].includes(value),
      },
      rel: {
        type: String,
        default: null,
      },
      scrollTo: {
        type: String,
        default: null,
      },
      forward: {
        type: Boolean,
        default: false,
      },
      back: {
        type: Boolean,
        default: false,
      },
      previousRoute: {
        type: Boolean,
        default: false,
      },
      forwardRoute: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      isRouterLink() {
        return typeof this.to === 'object' || !this.scrollTo;
      },
      classes() {
        return [
          'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
          this.variant === 'primary'
            ? this.outline
              ? 'text-indigo-600 hover:bg-indigo-600 hover:bg-opacity-10 border border-indigo-600 focus:ring-indigo-500'
              : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            : '',
          // ... (other variant styles omitted for brevity)
          this.underline ? 'underline' : '',
          this.size === 'sm' ? 'text-xs py-1 px-2 rounded' : '',
          this.size === 'md' ? 'text-sm px-4 rounded-md' : '',
          this.size === 'lg' ? 'text-base py-3 px-6 rounded-lg' : '',
        ];
      },
    },
    methods: {
      handleClick() {
        if (this.scrollTo) {
          const el = document.querySelector(`#${this.scrollTo}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (this.forward) {
          window.history.forward();
        } else if (this.back) {
          window.history.back();
        } else if (this.previousRoute) {
          this.$router.go(-1);
        } else if (this.forwardRoute) {
          this.$router.go(1);
        }
      },
    },
  };
  </script>