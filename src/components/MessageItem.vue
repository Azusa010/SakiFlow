<template>
  <div class="message-row" :class="{'message-row--user' :isUser}">
    <NAvatar round :color="isUser ? '#2563eb':'#7c3aed'">
      {{ isUser?'我':'AI' }}
    </NAvatar>

    <div class="message-body">
      <div class="message-content">{{ message.content }}</div>

      <div class="message-meta">
        <span>{{ message.createdAt }}</span>
        <NButton text size="tiny" @click="copyMessage">复制</NButton>
      </div>
    </div>

  </div>

</template>


<script setup lang="ts">
import type { ChatMessage } from '@/stores/chat';
import { NAvatar, NButton } from 'naive-ui';
import { computed } from 'vue';



interface MessageItemProps {
  message:ChatMessage
}

const props = defineProps<MessageItemProps>()

const isUser = computed(()=>props.message.role === 'user')

// 将当前消息内容复制到系统剪贴板
async function copyMessage():Promise<void>{
  try{
    await navigator.clipboard.writeText(props.message.content)
  }catch{

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
  background: #f1f5f9;
  color: #1e293b;
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
  color: #94a3b8;
  font-size: 12px;
}

.message-row--user .message-meta {
  justify-content: flex-end;
}
</style>
