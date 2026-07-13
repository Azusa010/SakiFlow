<template>
  <div class="message-row" :class="{ 'message-row--user': isUser }">
    <NAvatar round :color="isUser ? '#2563eb' : '#7c3aed'">
      {{ isUser ? '我' : 'AI' }}
    </NAvatar>

    <div class="message-body">
      <div v-if="isUser" class="message-content">{{ message.content }}</div>
      <div v-else class="message-content message-content--markdown" v-html="renderedContent"></div>

      <div class="message-meta">
        <span>{{ message.createdAt }}</span>
        <NButton text size="tiny" @click="copyMessage">
          <NIcon>
            <CopyOutline />
          </NIcon>
        </NButton>

        <NButton v-if="canRegenerate" text size="tiny" :disabled="isRegenerating" @click="emit('regenerate')">
          <NIcon>
            <RefreshOutline />
          </NIcon>
        </NButton>
      </div>
    </div>

  </div>

</template>


<script setup lang="ts">
import type { ChatMessage } from '@/stores/chat';
import { CopyOutline, RefreshOutline } from '@vicons/ionicons5';
import { NAvatar, NButton, NIcon } from 'naive-ui';
import { computed } from 'vue';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';
import MarkdownIt from 'markdown-it';
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)


interface MessageItemProps {
  message: ChatMessage
  canRegenerate: boolean
  isRegenerating: boolean
}

const emit = defineEmits<{
  regenerate: []
}>()

const props = defineProps<MessageItemProps>()

const isUser = computed(() => props.message.role === 'user')

//  转义未指定语言的代码块，防止代码中的 HTML 被当作标签执行。
function escapeHtml(code: string): string {
  return code.replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const markdown = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  highlight(code: string, language: string): string {
    const isSupportedLanguage = language && hljs.getLanguage(language)
    const highlightedCode = isSupportedLanguage
      ? hljs.highlight(code, { language }).value
      : escapeHtml(code)
    return `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`
  },
})

const renderedContent = computed(()=>{
  return DOMPurify.sanitize(markdown.render(props.message.content))
})

// 将当前消息内容复制到系统剪贴板
async function copyMessage(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.message.content)
  } catch {

  }
}
</script>

<style scoped>
.message-row {
  display: flex;
  max-width: 82%;
  align-items: flex-start;
  gap: 12px;
}

.message-row--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-body {
  min-width: 0;
}

.message-content {
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--surface-muted);
  color: var(--text-primary);
  line-height: 1.7;
  white-space: pre-wrap;
}

.message-row--user .message-content {
  background: #2563eb;
  color: #ffffff;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.message-row--user .message-meta {
  justify-content: flex-end;
}

.message-content--markdown {
  white-space: normal;
}

:deep(.message-content--markdown > :first-child) {
  margin-top: 0;
}

:deep(.message-content--markdown > :last-child) {
  margin-bottom: 0;
}

:deep(.message-content--markdown h1),
:deep(.message-content--markdown h2),
:deep(.message-content--markdown h3) {
  margin: 16px 0 8px;
  line-height: 1.35;
}

:deep(.message-content--markdown p),
:deep(.message-content--markdown ul),
:deep(.message-content--markdown ol) {
  margin: 8px 0;
}

:deep(.message-content--markdown ul),
:deep(.message-content--markdown ol) {
  padding-left: 22px;
}

:deep(.message-content--markdown code) {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--border-color);
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.message-content--markdown pre) {
  overflow-x: auto;
  margin: 12px 0;
  border-radius: 8px;
  background: #0d1117;
}

:deep(.message-content--markdown pre code) {
  display: block;
  padding: 14px;
  background: transparent;
  line-height: 1.6;
}

:deep(.message-content--markdown blockquote) {
  margin: 10px 0;
  padding-left: 12px;
  border-left: 3px solid var(--text-muted);
  color: var(--text-secondary);
}
</style>
