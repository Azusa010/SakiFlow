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

          <NButton type="primary" :loading="isProcessing" :disabled="!content.trim()||isProcessing" @click="handleAiAction('polish')">
            AI 优化
          </NButton>

          <NButton :loading="isProcessing" :disabled="isProcessing||!content.trim()" @click="handleAiAction('summary')">
            AI 摘要
          </NButton>
        </div>
        <NButton text type="error" :disabled="!content.trim()" @click="handleClear">
          清空正文
        </NButton>
      </div>

      <CodeEditor ref="codeEditorRef" v-model="content" :language="language" height="480px" />
    </NCard>
  </div>

</template>

<script setup lang="ts">
import { NButton, NCard, NDivider, NInput, NSelect } from 'naive-ui'
import { computed, ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'

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

const isProcessing = ref(false)

type AiAction = 'polish' | 'summary'

async function handleAiAction(action: AiAction) {
  const currentContent = content.value.trim()
  if (!currentContent || isProcessing.value) {
    return
  }

  isProcessing.value = true

  await new Promise < void> (res => {
    window.setTimeout(res, 600);
  })

  if (action === 'polish') {
    content.value = `【AI 润色版】\n${currentContent}`
  } else {
    content.value = `${currentContent}\n\n---\nAI 摘要: 这段内容已完成核心信息提取，可继续结合具体场景补充细节。`
  }

  isProcessing.value = false
}

function handleFormat(){
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
  color: #64748b;
}

.word-count {
  color: #94a3b8;
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
