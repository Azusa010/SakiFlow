import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => {
    return Boolean(token.value && userInfo.value)
  })

  function setUser(newToken: string, newUserInfo: UserInfo) {
    token.value = newToken
    userInfo.value = newUserInfo

    localStorage.setItem('sakiflow_token', newToken)
    localStorage.setItem('sakiflow_userInfo', JSON.stringify(newUserInfo))
  }
  function restoreUser() {
    const savedToken = localStorage.getItem('sakiflow_token')
    const savedUserInfo = localStorage.getItem('sakiflow_userInfo')
    if (savedToken && savedUserInfo) {
      token.value = savedToken
      try {
        userInfo.value = JSON.parse(savedUserInfo) as UserInfo
      } catch {
        logout()
      }
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('sakiflow_token')
    localStorage.removeItem('sakiflow_userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setUser,
    logout,
    restoreUser,
  }
})
