<template>
  <div class="login-page">
    <NCard class="login-card" :bordered="false">
      <section class="login-heading">
        <h1>SakiFlow</h1>
        <p>登陆你的 AI 智能工作流平台</p>
      </section>

      <NForm ref="formRef" :model="formValue" :rules="loginRules" @submit.prevent="handleSubmit">
        <NFormItem label="用户名" path="username">
          <NInput v-model:value="formValue.username" placeholder="请输入用户名" />
        </NFormItem>

        <NFormItem label="密码" path="password">
          <NInput v-model:value="formValue.password" type="password" show-password-on="click" placeholder="请输入密码" />
        </NFormItem>

        <NButton block type="primary" attr-type="submit" :loading="isSubmitting">登录</NButton>
      </NForm>
      <div class="register-link">
        没有账号?
        <NButton text type="primary" @click="router.push('/register')">去注册</NButton>
      </div>
    </NCard>
  </div>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { NButton, NForm, NFormItem, NInput, type FormInst, type FormRules, NCard } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

interface Loginform {
  username: string;
  password: string;
}

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)

const formValue = reactive<Loginform>({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['input', 'blur']
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur']
    }
  ]
}


async function handleSubmit(): Promise<void> {
  await formRef.value?.validate()

  isSubmitting.value = true
  try {
    userStore.setUser('mock-token', {
      id: 'user-001',
      username: formValue.username,
      nickname: formValue.username,
    })
    await router.push('/dashboard')
  } finally {
    isSubmitting.value = false
  }

}
</script>


<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left,
      rgba(37, 99, 235, 0.18),
      transparent 38%),
    linear-gradient(135deg,
      var(--surface-muted),
      var(--app-bg));
}

.login-card {
  width: 100%;
  max-width: 420px;
  box-shadow: 0 18px 45px rgba(30, 64, 175, 0.12);
}

.login-card :deep(.n-card__content) {
  padding: 36px;
}

.login-heading {
  margin-bottom: 28px;
  text-align: center;
}

.login-heading h1 {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 28px;
}

.login-heading p {
  margin: 0;
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }

  .login-card :deep(.n-card__content) {
    padding: 28px 24px;
  }
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
