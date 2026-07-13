<template>
  <div class="register-page">
    <NCard class="register-card" :bordered="false">
      <section class="register-heading">
        <h1>创建账号</h1>
        <p>注册 SakiFlow 开始使用 AI 智能工作流。</p>
      </section>

      <NForm ref="formRef" :model="formValue" :rules="registerRules" @submit.prevent="handleSubmit">
        <NFormItem label="用户名" path="username">
          <NInput v-model:value="formValue.username" placeholder="请输入用户名" />
        </NFormItem>

        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="formValue.email" placeholder="请输入邮箱地址" />
        </NFormItem>

        <NFormItem label="密码" path="password">
          <NInput v-model:value="formValue.password" type="password" placeholder="请输入密码" show-password-on="click" />
        </NFormItem>

        <NFormItem label="确认密码" path="confirmPassword">
          <NInput v-model:value="formValue.confirmPassword" type="password" placeholder="请再次输入密码"
            show-password-on="click" />
        </NFormItem>

        <NButton block type="primary" attr-type="submit" :loading="isSubmitting">注册并进入平台</NButton>
      </NForm>



      <div class="login-link">
        已有账号?
        <NButton text type="primary" @click="router.push('/login')">去登录</NButton>
      </div>
    </NCard>


  </div>

</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { NButton, NCard, NForm, NFormItem, NInput, type FormInst, type FormRules } from 'naive-ui';
import { reactive, ref } from 'vue';

interface RegisterForm {
  username: string,
  email: string,
  password: string,
  confirmPassword: string
}

const router = useRouter()
const userStore = useUserStore()
const formRef = ref < FormInst | null > (null)
const isSubmitting = ref(false)

const formValue = reactive < RegisterForm > ({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const registerRules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['input', 'blur']
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur']
    },
    {
      min: 6,
      message: '密码长度不能小于6位',
      trigger: ['input', 'blur']
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur']
    },
    {
      validator: (_rule, value) => {
        return value === formValue.password
      },
      trigger: ['input', 'blur']
    }
  ]
}


// 校验注册信息，写入 mock 登录状态后跳转到仪表盘。
async function handleSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  isSubmitting.value = true

  try {
    userStore.setUser(`mock-token-${Date.now()}`, {
      id: `user-${Date.now()}`,
      username: formValue.username,
      email: formValue.email,
      nickname: formValue.username
    })

    await router.push('/dashboard')
  } finally {
    isSubmitting.value = false
  }

}


</script>


<style scoped>
.register-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top right, #dbeafe, transparent 38%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
}

.register-card {
  width: 100%;
  max-width: 440px;
  box-shadow: 0 18px 45px rgba(30, 64, 175, 0.12);
}

.register-card :deep(.n-card__content) {
  padding: 36px;
}

.register-heading {
  margin-bottom: 28px;
  text-align: center;
}

.register-heading h1 {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 28px;
}

.register-heading p {
  margin: 0;
  color: #64748b;
}

.login-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 480px) {
  .register-page {
    padding: 16px;
  }

  .register-card :deep(.n-card__content) {
    padding: 28px 24px;
  }
}
</style>
