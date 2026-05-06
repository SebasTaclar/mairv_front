<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
  >
    <div class="toggle-container">
      <div class="toggle-slider" :class="{ 'dark': isDark }">
        <div class="toggle-icon">
          <span v-if="isDark" class="icon">🌙</span>
          <span v-else class="icon">☀️</span>
        </div>
      </div>
    </div>
  </button>

</template>

<script setup lang="ts">
import './styles/ThemeToggle.css'
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false) // Default to light mode

const toggleTheme = () => {
 isDark.value = !isDark.value
 updateTheme()
}

const updateTheme = () => {
 const root = document.documentElement

 if (isDark.value) {
  root.setAttribute('data-theme', 'dark')
  localStorage.setItem('theme', 'dark')
 } else {
  root.setAttribute('data-theme', 'light')
  localStorage.setItem('theme', 'light')
 }
}

// Load saved theme on component mount
onMounted(() => {
 const savedTheme = localStorage.getItem('theme')
 if (savedTheme) {
  isDark.value = savedTheme === 'dark'
 } else {
  // Check system preference if no saved theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = prefersDark
 }
 updateTheme()
})

// Watch for changes and update theme
watch(isDark, () => {
 updateTheme()
}, { immediate: true })
</script>



