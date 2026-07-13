import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

// 聊天消息发送方
export type MessageRole = 'user' | 'assistant'

// 单条聊天信息
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

// 一个独立的聊天会话及其完整的消息历史
export interface ChatSession {
  id: string
  title: string
  workflowId?: string
  messages: ChatMessage[]
  updatedAt: string
}

export const useChatStore = defineStore('chat', () => {
  const sessions = useStorage<ChatSession[]>('sakiflow_chat_sessions', [])
  const activeSessionId = useStorage<string | null>('sakiflow_active_chat_id', null)
  const isGenerating = ref(false)

  // 当前的会话
  const activeSession = computed(
    () => sessions.value.find((session) => session.id === activeSessionId.value) || null,
  )

  // 当前会话消息
  const activeMessages = computed(() => activeSession.value?.messages ?? [])

  // 等待指令时前
  function sleep(delay: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, delay)
    })
  }

  async function streamAIReplay(session: ChatSession, reply: string): Promise<void> {
    const AIMessage: ChatMessage = {
      id: `message-${Date.now()}-assistant`,
      role: 'assistant',
      content: '',
      createdAt: '刚刚',
    }
    session.messages.push(AIMessage)

    const reactiveAImessage = session.messages.at(-1)
    if(!reactiveAImessage) return

    for (let index = 0; index < reply.length; index+=2) {
      await sleep(45)
      reactiveAImessage.content += reply.slice(index, index + 2)
    }

    session.updatedAt = '刚刚'
  }

  // 创建会话并切换为当前会话
  function createSession(workflowId?: string): ChatSession {
    const session: ChatSession = {
      id: `chat-${Date.now()}`,
      title: '新对话',
      workflowId,
      messages: [],
      updatedAt: '刚刚',
    }
    sessions.value.unshift(session)
    activeSessionId.value = session.id
    return session
  }

  // 切换当前聊天会话
  function selectSession(id: string): void {
    activeSessionId.value = id
  }

  // 删除会话
  function deleteSession(id: string): void {
    sessions.value = sessions.value.filter((session) => session.id !== id)

    if (activeSessionId.value === id) {
      activeSessionId.value = sessions.value[0]?.id ?? null
    }
  }

  async function regenerateLastAnswer(): Promise<void> {
    const session = activeSession.value
    const lastMessage = session?.messages.at(-1)

    if (!session || !lastMessage || lastMessage.role !== 'assistant' || isGenerating.value) return

    const previousUserMessage = [...session.messages].reverse().find((msg) => msg.role === 'user')

    if (!previousUserMessage) return
    isGenerating.value = true

    try {
      session.messages.pop()

      await streamAIReplay(session, `这是对「${previousUserMessage.content}」重新生成的回复。`)
    } finally {
      isGenerating.value = false
    }
  }

  // 发送用户消息
  async function sendMessage(content: string): Promise<void> {
    const messageContent = content.trim()
    if (!messageContent || isGenerating.value) return

    const session = activeSession.value ?? createSession()

    session.messages.push({
      id: `message-${Date.now()}`,
      role: 'user',
      content: messageContent,
      createdAt: '刚刚',
    })

    session.title = session.title === '新对话' ? messageContent.slice(0, 20) : session.title
    session.updatedAt = '刚刚'
    isGenerating.value = true

    try {
      await streamAIReplay(
        session,
        `这是对「${messageContent}」的回复。\n\n\`\`\`ts\nconst workflow = 'SakiFlow'\nconsole.log(workflow)\n\`\`\``,
      )
    } finally {
      isGenerating.value = false
    }
  }

  return {
    sessions,
    activeSessionId,
    isGenerating,
    activeSession,
    activeMessages,
    createSession,
    selectSession,
    deleteSession,
    sendMessage,
    regenerateLastAnswer,
  }
})
