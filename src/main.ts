import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/user.ts'
import App from './App.vue'
import router from './route/index.ts'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const userStore = useUserStore(pinia)
userStore.restoreUser()

app.use(router)


app.mount('#app')
