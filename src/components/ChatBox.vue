<template>
  <div class="chat-box">
    <NInput v-model:value="inputValue" type="textarea" :disabled="loading" :autosize="{ minRows: 2, maxRows: 6 }"
      @keydown.enter.exact.prevent="handleSend" />

    <div class="chat-box-footer">
      <span>Enter 发送 · Shift + Enter 换行</span>

      <NButton type="primary" :loading="loading" :disabled="!inputValue.trim()" @click="handleSend">
        发送
      </NButton>
    </div>


  </div>

</template>


<script lang="ts" setup>
import { NButton, NInput } from 'naive-ui';
import { ref } from 'vue';


interface ChatBoxProps {
  loading: boolean
}

const props = defineProps<ChatBoxProps>()

const emit = defineEmits<{ send: [content: string] }>()


const inputValue = ref('')

function handleSend(): void {
  const content = inputValue.value.trim()

  if (!content || props.loading) return
  emit('send', content)

  inputValue.value = ''
}

</script>
<style scoped>
.chat-box {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.chat-box-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: #94a3b8;
  font-size: 12px;
}
</style>
