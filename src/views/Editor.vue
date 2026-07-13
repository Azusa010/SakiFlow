<template>
  <div class="editor-page">
    <div class="page-header">
      <div>
        <h1>AI 编辑器</h1>
        <p>在这里编写内容，后续可使用 AI 进行优化</p>
      </div>

      <span class="word-count">已输入 {{ wordCount }} 字</span>
    </div>

    <NCard class="editor-card">
      <NInput v-model:value="title" class="title-input" placeholder="请输入文档标题" size="large" />
      <NDivider />

      <div class="editor-toolbar">
        <div class="toolbar-actions">
          <NSelect v-model:value="language" :options="languageOptions" style="width: 140px;" />

          <NButton :disabled="!content.trim()" @click="handleFormat">
            格式化代码
          </NButton>

          <NButton type="primary" :loading="isProcessing" :disabled="!content.trim()||isProcessing" @click="handleAiAction('optimize')">
            AI 优化
          </NButton>

          <NButton :loading="isProcessing" :disabled="isProcessing||!content.trim()" @click="handleAiAction('explain')">
            AI 解释
          </NButton>
        </div>
        <NButton text type="error" :disabled="!content.trim()" @click="handleClear">
          清空正文
        </NButton>
      </div>

      <NAlert v-if="processingError" class="processing-error" type="error" title="AI 处理失败">{{ processingError }}</NAlert>

      <CodeEditor ref="codeEditorRef" v-model="content" :language="language" height="480px" :theme="editorTheme"  />
    </NCard>
  </div>

</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NDivider, NInput, NSelect } from 'naive-ui'
import { computed, ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'
import { useSettingsStore } from '@/stores/settings'
import { usePreferredDark } from '@vueuse/core'
import { useAsyncTask } from '@/composables/useAsyncTask'

const settingsStore = useSettingsStore()
const prefersDark = usePreferredDark()

const editorTheme = computed<'vs'|'vs-dark'>(()=>{
  const selectedTheme = settingsStore.preferences.theme
  const isDark = selectedTheme === 'dark' || (selectedTheme === 'system' && prefersDark.value)

  return isDark ? 'vs-dark' : 'vs'
})

const title = ref('未命名文档')

const content = ref('')

const language = ref('typescript')

const languageOptions = [
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Vue', value: 'html' },
]

const codeEditorRef = ref<InstanceType<typeof CodeEditor> | null>(null)

const wordCount = computed(() => {
  return content.value.replace(/\s/g, '').length
})


type AiAction = 'optimize' | 'explain'

async function requestAiAction(action:AiAction,sourceCode:string):Promise<string>{
  await new Promise<void>(res=>window.setTimeout(res,600))

  if (action === 'optimize') {
    return `// 【AI 优化版】\n${sourceCode}`
  }

  return `${sourceCode}\n\n/**\n * AI 解释：这段代码已完成结构分析，可继续结合具体业务补充执行流程说明。\n */`
}

const {
  isLoading: isProcessing,
  error: processingError,
  execute: executeAiAction,
} = useAsyncTask(requestAiAction)

async function handleAiAction(action:AiAction):Promise<void>{
  const currentContent = content.value
  if(!currentContent || isProcessing.value) return

  const result = await executeAiAction(action,currentContent)
  if(result!==null){
    content.value = result
  }
}

function handleFormat():void{
  void codeEditorRef.value?.formatDocument()
}


function handleClear(): void {
  content.value = ''
}
</script>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 8px 0 0;
  color: var(--text-secondary);
}

.word-count {
  color: var(--text-muted);
  font-size: 13px;
  white-space: nowrap;
}

.editor-toolbar,
.toolbar-actions {
  display: flex;
  align-items: center;
}

.editor-toolbar {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar-actions {
  gap: 10px;
}

.editor-card {
  min-height: 560px;
}

.title-input :deep(input) {
  font-size: 20px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }
}
</style>
