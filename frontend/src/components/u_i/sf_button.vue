<template>
  <component
    :is="as"
    :type="type"
    :disabled="disabled"
    :class="classes"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: "UIButton",
  props: {
    type: {
      type: String,
      default: "button",
      validator: (value) => {
        return ["button", "submit", "reset"].includes(value);
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "primary",
      validator: (value) => {
        return [
          "primary",
          "secondary",
          "success",
          "danger",
          "warning",
          "info",
          "light",
          "dark",
        ].includes(value);
      },
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => {
        return ["sm", "md", "lg"].includes(value);
      },
    },
    outline: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    as: {
      type: String,
      default: "button",
      validator: (value) => {
        return ["button", "a", "router-link"].includes(value);
      },
    },
  },
  computed: {
    classes() {
      return [
        "inline-flex items-center font-bold justify-center px-4 border border-transparent text-sm  rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
        this.variant === "primary"
          ? "text-white bg-webPrimary hover:bg-webPrimaryHover focus:ring-webPrimary"
          : "",
        this.variant === "secondary"
          ? "text-webBackground bg-webSecondary hover:bg-webSecondaryHover focus:ring-webSecondary"
          : "",
        this.variant === "success"
          ? "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
          : "",
        this.variant === "danger"
          ? "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
          : "",
        this.variant === "warning"
          ? "text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
          : "",
        this.variant === "info"
          ? "text-white bg-webPrimary hover:bg-webPrimaryHover focus:ring-webPrimary"
          : "",
        this.variant === "light"
          ? "text-gray-700 bg-webBackground hover:bg-webBackgroundHover focus:ring-gray-500"
          : "",
        this.variant === "dark"
          ? "text-white bg-webBackgroundDark hover:bg-webBackgroundDarkHover focus:ring-gray-500"
          : "",
        this.outline
          ? `text-${this.variant} bg-transparent hover:bg-${this.variant} hover:bg-opacity-10 border-${this.variant} focus:ring-${this.variant}`
          : "",
        this.size === "sm" ? "text-xs py-2 px-2 rounded" : "",
        this.size === "md" ? "text-sm py-2 px-4 rounded-md" : "",
        this.size === "lg" ? "text-base py-3 px-6 rounded-lg" : "",
        this.block ? "w-full" : "",
      ];
    },
  },
};
</script>