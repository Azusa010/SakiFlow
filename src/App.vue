<template>
  <NConfigProvider :theme="naiveTheme">
    <NGlobalStyle />
    <RouterView />
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui';
import { RouterView } from 'vue-router';
import { useSettingsStore } from './stores/settings';
import { usePreferredDark } from '@vueuse/core';
import { computed, watch } from 'vue';

const settingsStore = useSettingsStore()
const prefersDark = usePreferredDark()
const isDarkMode = computed(() => {
  if (settingsStore.preferences.theme === 'system') {
    return prefersDark.value
  }

  return settingsStore.preferences.theme === 'dark'
})

const naiveTheme = computed(() => {
  return isDarkMode.value ? darkTheme : null
})

// 为项目中的自定义 CSS 提供统一的主题标记
watch(isDarkMode, (isDark) => {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
}, { immediate: true })
</script>
