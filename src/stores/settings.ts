import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export type Apptheme = 'light' | 'dark' | 'system'

export interface AppPreferences {
  theme: Apptheme
  model: string
  apiKey: string
}

export const useSettingsStore = defineStore('settings', () => {
  const preferences = useStorage<AppPreferences>('sakiflow_preferences', {
    theme: 'system',
    model: 'gpt-4o-mini',
    apiKey: '',
  })

  // 更新用户偏好设置
  function updatePreferences(payload: Partial<AppPreferences>) {
    preferences.value = {
      ...preferences.value,
      ...payload,
    }
  }

  // 消除 API Key
  function clearApiKey(): void {
    preferences.value.apiKey = ''
  }

  return {
    preferences,
    updatePreferences,
    clearApiKey,
  }
})
