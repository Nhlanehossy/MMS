<template>
  <div class="relative inline-block mt-3 text-left text-text">
    <a-dropdown :trigger="['click']" @visibleChange="handleDropdownVisibleChange">
      <a class="ant-dropdown-link" @click.prevent>
        <a-space>
          <global-outlined />
          {{ languageNames[selectedLanguage] }}
          <down-outlined />
        </a-space>
      </a>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item v-for="lang in availableLanguages" :key="lang">
            <a :class="['block px-4 py-2 text-sm cursor-pointer', selectedLanguage === lang ? 'text-text font-extrabold' : 'text-text hover:text-gray-900']">
              {{ languageNames[lang] }}
            </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <p class="mt-4 text-xl font-medium">{{ translationKeys.Hello }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { Dropdown, Menu, Space } from 'ant-design-vue';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons-vue';
import { translationKeys, availableLanguages, getLanguage, setLanguage } from '../executables/translation';

export default defineComponent({
  components: {
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ASpace: Space,
    GlobalOutlined,
    DownOutlined,
  },
  setup() {
    const selectedLanguage = ref(getLanguage());
    const isOpen = ref(false);
    const languageNames = {
      en: 'Eng',
      ja: '日本語',
      ch: '中文',
      es: 'Español',
      fr: 'Français',
      pt: 'Português',
      sw: 'Kiswahili',
      ny: 'Chichewa',
      yao: 'Chiyao',
      sena: 'Chisena',
      tumbuka: 'Chitumbuka'
    };

    const handleDropdownVisibleChange = (visible) => {
      isOpen.value = visible;
    };

    const handleMenuClick = ({ key }) => {
      changeLanguage(key);
    };

    const changeLanguage = (lang) => {
      selectedLanguage.value = lang;
      setLanguage(lang);
      isOpen.value = false;
      // Force component re-render
      Object.assign({}, translationKeys);
      window.location.reload();
    };

    return {
      selectedLanguage,
      availableLanguages,
      languageNames,
      changeLanguage,
      translationKeys,
      isOpen,
      handleDropdownVisibleChange,
      handleMenuClick,
    };
  }
});
</script>