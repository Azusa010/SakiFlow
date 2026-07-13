<template>
  <div class="chat-page">
    <aside class="session-sidebar">
      <div class="session-sidebar-header">
        <strong>对话记录</strong>
        <NButton size="small" type="primary" @click="chatStore.createSession()">新建</NButton>
      </div>

      <NEmpty v-if="chatStore.sessions.length === 0" size="small" description="还没有对话" class="session-empty" />
      <NVirtualList v-else class="session-list" :items="virtualSessions" :item-size="64">
        <template #default="{ item: session }">
          <div :key="session.key" class="session-list-item" :class="{
            'session-item--active':
              session.id === chatStore.activeSessionId,
          }" @click="chatStore.selectSession(session.id)">
            <div class="session-item">
              <div>
                <strong>{{ session.title }}</strong>
                <p>{{ session.updatedAt }}</p>
              </div>

              <NButton text type="error" size="tiny" @click.stop="chatStore.deleteSession(session.id)">
                删除
              </NButton>
            </div>
          </div>
        </template>
      </NVirtualList>
    </aside>

    <section class="chat-main">
      <header class="chat-header">{{ chatStore.activeSession?.title ?? 'AI 聊天' }}</header>
      <div v-if="chatStore.activeMessages.length" class="message-list">
        <MessageItem v-for="(message, index) in chatStore.activeMessages" :key="message.id" :message="message"
          :is-regenerating="chatStore.isGenerating"
          :can-regenerate="message.role === 'assistant' && index === chatStore.activeMessages.length - 1 && !chatStore.isGenerating"
          @regenerate="chatStore.regenerateLastAnswer" />
        <NSpin v-if="chatStore.isGenerating" size="small">AI 正在思考...</NSpin>
      </div>

      <NEmpty v-else description="开始一段新对话吧" class="chat-empty" />

      <ChatBox :loading="chatStore.isGenerating" @send="handleSend" />
    </section>
  </div>
</template>


<script setup lang="ts">
import { useChatStore, type ChatSession } from '@/stores/chat';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ChatBox from '@/components/ChatBox.vue';
import MessageItem from '@/components/MessageItem.vue';
import { NButton, NEmpty, NSpin,NVirtualList } from 'naive-ui';

const route = useRoute()
const chatStore = useChatStore()
// 悉尼列表使用的会话数
type VirtualChatSession = ChatSession & { key: string }

// 为绘画记录补充key
const virtualSessions = computed<VirtualChatSession[]>(() => {
  return chatStore.sessions.map((session) => ({
    ...session,
    key: session.id
  }))
})


onMounted(() => {
  const workflowId = route.query.workflowId

  if (typeof workflowId === 'string') {
    chatStore.createSession(workflowId)
  }
})

function handleSend(content: string): void {
  chatStore.sendMessage(content)
}
</script>

<style scoped>
.chat-page {
  display: flex;
  height: calc(100vh - 112px);
  min-height: 560px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-color);
}

.session-sidebar {
  width: 260px;
  flex: 0 0 260px;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
}

.session-sidebar-header,
.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.session-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.session-item p {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.session-item--active {
  background: var(--primary-soft);
}

.session-empty {
  padding: 48px 0;
}

.chat-main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.chat-header {
  padding: 17px 20px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
}

.message-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  padding: 24px;
}

.chat-empty {
  flex: 1;
}

@media (max-width: 768px) {
  .session-sidebar {
    display: none;
  }

  .chat-page {
    height: calc(100vh - 96px);
    border-right: 0;
    border-left: 0;
    border-radius: 0;
  }
}
.session-list {
  height: calc(100% - 65px);
}

.session-list-item {
  box-sizing: border-box;
  height: 64px;
  padding: 12px 16px;
  cursor: pointer;
}

.session-list-item:hover {
  background: var(--surface-muted);
}
</style>
