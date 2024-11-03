<template>
  <div class="text-text">
    <i 
      @click="toggleTheme" 
      :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
    >
    
  </i>
    

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeManager } from '../executables/themeManager'

const { activeTheme, setTheme } = useThemeManager()

const isDarkMode = computed(() => activeTheme.value === 'Dark')

function toggleTheme() {
  setTheme(isDarkMode.value ? 'Light' : 'Dark')
}
</script>


<style scoped>
i{
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 8px;
}
i:hover{
  transform: scale(1.2);
}
</style>