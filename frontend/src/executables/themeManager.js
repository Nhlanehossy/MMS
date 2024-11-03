// themeManager.js
import { ref, watch } from "vue";
import { theme } from 'ant-design-vue';
import { generate } from '@ant-design/colors';

const activeTheme = ref("default");
const customThemes = ref({});
const antDesignTheme = ref({});

const Light = {
  text: "#2C3E50", // Dark text color
  textLight: "#F9F9F9", // Light text color
  textLighter: "#9c9b9b", // Lighter text color
  textDark: "#1A1A1A", // Darker text color
  textDarker: "#000000", // Darkest text color
  fill: "#E8F5E9", // Light green fill color
  cardLight: "#FFFFFF", // Light card background
  cardDark: "#F0F0F0", // Dark card background
  background: "#F5F5F5", // General background color
  primary: "#4CAF50", // Primary green color
  secondary: "#A5D6A7", // Secondary lighter green
  tertiary: "#C8E6C9", // Tertiary even lighter green
  menubg: "#C8E6C9", // Menu background in light green
  backgroundHover: "#A5D6A7", // Hover background in light green
  webPrimary: "#4CAF50", // Web primary color (green)
  webSecondary: "#A5D6A7", // Web secondary color (lighter green)
  webBackground: "#FFFFFF", // Web background color
  webBackgroundDark: "#F5F5F5", // Darker web background
  webPrimaryHover: "#388E3C", // Darker green for web primary hover
  webSecondaryHover: "#C8E6C9", // Lighter green for web secondary hover
  webBackgroundHover: "#F9F9F9", // Hover color for web background
  webBackgroundDarkHover: "#E0E0E0", // Dark hover color for web background
};

const Dark = {
  text: "#F9F9F9", // Light text color
  textLight: "#FFFFFF", // White text color
  textLighter: "#E0E0E0", // Lighter text color
  textDark: "#A5D6A7", // Light green text
  fill: "#2E7D32", // Dark fill color
  textDarker: "#C7C7C7", // Darker light text color
  cardLight: "#1B1B1B", // Dark card background
  cardDark: "#222222", // Darker card background
  background: "#121212", // Dark general background color
  primary: "#4CAF50", // Primary green color
  secondary: "#66BB6A", // Secondary green
  tertiary: "#A5D6A7", // Tertiary lighter green
  menubg: "#1F2C3A", // Menu background
  backgroundHover: "#388E3C", // Darker green for hover
  webPrimary: "#4CAF50", // Web primary color (green)
  webSecondary: "#66BB6A", // Web secondary green
  webBackground: "#1F1F1F", // Dark web background
  webBackgroundDark: "#151515", // Darker web background
  webPrimaryHover: "#388E3C", // Darker green for web primary hover
  webSecondaryHover: "#C8E6C9", // Lighter green for web secondary hover
  webBackgroundHover: "#1E1E1E", // Hover color for web background
  webBackgroundDarkHover: "#0F0F0F", // Dark hover color for web background
};

const premadeThemes = {
  Light: Light,
  Dark: Dark,
};

export function useThemeManager() {
  function setTheme(themeName) {
    activeTheme.value = themeName;
    applyTheme(themeName);
  }

  function addCustomTheme(name, colors) {
    customThemes.value[name] = colors;
  }

  function updateAntDesignTheme(colors) {
    const primaryColor = colors.primary;
    const primaryColors = generate(primaryColor);

    antDesignTheme.value = {
      token: {
        colorPrimary: primaryColor,
        colorBgContainer: colors.background,
        colorText: colors.text,
        colorTextSecondary: colors.textLight,
      },
      algorithm: colors === premadeThemes.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };
  }

  function applyTheme(themeName) {
    let theme = premadeThemes[themeName] || customThemes.value[themeName] || Light;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    updateAntDesignTheme(theme);
  }

  function saveThemesToStorage() {
    localStorage.setItem("customThemes", JSON.stringify(customThemes.value));
    localStorage.setItem("activeTheme", activeTheme.value);
  }

  function loadThemesFromStorage() {
    const storedThemes = localStorage.getItem("customThemes");
    if (storedThemes) {
      customThemes.value = JSON.parse(storedThemes);
    }

    const storedActiveTheme = localStorage.getItem("activeTheme");
    if (storedActiveTheme) {
      setTheme(storedActiveTheme);
    } else {
      setTheme("default");
    }
  }

  function removeCustomTheme(themeName) {
    if (customThemes.value[themeName]) {
      delete customThemes.value[themeName];
      if (activeTheme.value === themeName) {
        setTheme("default");
      }
    }
  }

  function getThemeNames() {
    return [
      "default",
      ...Object.keys(premadeThemes),
      ...Object.keys(customThemes.value),
    ];
  }

  function getThemeColors(themeName) {
    if (themeName === "default") {
      return Light;
    } else if (premadeThemes[themeName]) {
      return premadeThemes[themeName];
    } else {
      return customThemes.value[themeName];
    }
  }

  // Watch for changes in customThemes and activeTheme
  watch(customThemes, saveThemesToStorage, { deep: true });
  watch(activeTheme, saveThemesToStorage);

  // Initial load from storage
  loadThemesFromStorage();

  return {
    activeTheme,
    customThemes,
    setTheme,
    addCustomTheme,
    removeCustomTheme,
    getThemeNames,
    getThemeColors,
    Light,
    premadeThemes,
    antDesignTheme,
  };
}