<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1>设置</h1>
        <p>管理你的个人资料与帐号状态</p>
      </div>
    </div>


    <NCard title="个人资料">
      <NAlert v-if="isSaved" class="save-alert" type="success" :show-icon="false">
        设置已保存
      </NAlert>

      <NForm ref="formRef" class="profile-form" :model="formValue" :rules="formRules" label-placement="top"
        @submit.prevent="handleSave">
        <NFormItem label="用户名">
          <NInput :value="userStore.userInfo?.username ?? ''" readonly />
        </NFormItem>

        <NFormItem label="昵称" path="nickname">
          <NInput v-model:value="formValue.nickname" placeholder="请输入昵称"></NInput>
        </NFormItem>

        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="formValue.email" placeholder="请输入邮箱地址"></NInput>
        </NFormItem>

        <NButton type="primary" attr-type="submit" :loading="isSaving">保存资料</NButton>
      </NForm>
    </NCard>

    <NCard title="AI 配置">
      <NForm label-placement="top" class="profile-form">
        <NFormItem label="主题">
          <NSelect v-model:value="preferencesForm.theme" :options="themeOptions" />
        </NFormItem>

        <NFormItem label="AI 模型">
          <NSelect v-model:value="preferencesForm.model" :options="modelOptions" />
        </NFormItem>

        <NFormItem label="API Key">
          <NInput v-model:value="preferencesForm.apiKey" type="password" show-password-on="click"
            placeholder="请输入 API Key" />
        </NFormItem>

        <div class="settings-actions">
          <NButton type="primary" @click="handleSavePreferences">保存配置</NButton>

          <NButton @click="handleExport">导出配置</NButton>
        </div>
      </NForm>
    </NCard>

    <NCard class="account-card" title="账号">
      <div class="logout-content">
        <div>
          <strong>退出登录</strong>
          <p>退出后需要重新登陆才能访问平台内容</p>
        </div>

        <NButton type="error" @click="handleLogout">退出登录</NButton>
      </div>
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { type FormInst, NAlert, NCard, NForm, type FormRules, NFormItem, NInput, NButton, NSelect } from 'naive-ui';
import { reactive, ref } from 'vue';
import { useSettingsStore, type AppPreferences } from '@/stores/settings';

interface ProfileForm {
  nickname: string
  email: string
}

const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const formRef = ref<FormInst | null>(null)
const isSaving = ref(false)
const isSaved = ref(false)
const preferencesForm = reactive<AppPreferences>({
  theme: settingsStore.preferences.theme,
  model: settingsStore.preferences.model,
  apiKey: settingsStore.preferences.apiKey,
})

const themeOptions = [
  { label: '跟随系统', value: 'system' },
  { label: '浅色模式', value: 'light' },
  { label: '深色模式', value: 'dark' },
]

const modelOptions = [
  { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
]

const formValue = reactive<ProfileForm>({
  nickname: userStore.userInfo?.nickname || '',
  email: userStore.userInfo?.email || '',
})

const formRules: FormRules = {
  nickname: [
    {
      required: true,
      message: '请输入昵称',
      trigger: ['input', 'blur'],
    }
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['input', 'blur'],
    }
  ]
}

async function handleSave(): Promise<void> {
  await formRef.value?.validate()

  isSaving.value = true

  try {
    userStore.updateUser({
      nickname: formValue.nickname,
      email: formValue.email,
    })
    isSaved.value = true

  } finally {
    isSaving.value = false
  }
}
// 保存主题、模型和 API Key 设置
function handleSavePreferences(): void {
  settingsStore.updatePreferences(preferencesForm)
  isSaved.value = true
}

// 将当前用户资料与偏好设置导出为 JSON 文件
function handleExport(): void {
  const exportContent = JSON.stringify({
    profile: userStore.userInfo,
    preferences: settingsStore.preferences
  },
    null,
    2,
  )

  const blob = new Blob([exportContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = 'saki-flow-settings.json'
  anchor.click()

  URL.revokeObjectURL(url)
}

async function handleLogout(): Promise<void> {
  userStore.logout()
  await router.replace('/login')
}
</script>
<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 760px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 8px 0 0;
  color: #64748b;
}

.profile-form {
  max-width: 520px;
}

.save-alert {
  margin-bottom: 20px;
}

.account-card {
  margin-top: 4px;
}

.logout-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logout-content strong {
  color: #334155;
}

.logout-content p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
}

.settings-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 640px) {
  .logout-content {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
