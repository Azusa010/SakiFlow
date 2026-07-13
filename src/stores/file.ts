import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type fileStatus = 'ready' | 'analyzing' | 'completed'

// 文件中心展示及分析所需的数据
export interface FileRecord {
  id: string
  name: string
  size: number
  type: string
  status: fileStatus
  uploadedAt: string
  analysis?: string
}

export const useFileStore = defineStore('file', () => {
  const files = ref<FileRecord[]>([])
  const selectedFileId = ref<string | null>(null)

  const selectedFile = computed(() => {
    return files.value.find((file) => file.id === selectedFileId.value) ?? null
  })

  // 将浏览器选择的文件转为应用内文件记录
  function addFiles(uploadedFiles: File[]): void {
    const records = uploadedFiles.map<FileRecord>((file) => ({
      id: `file-${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      status: 'ready',
      uploadedAt: '刚刚',
    }))
    files.value.unshift(...records)
    selectedFileId.value = records[0]?.id ?? selectedFileId.value
  }

  function selectFile(id: string): void {
    selectedFileId.value = id
  }

  function removeFile(id: string): void {
    files.value = files.value.filter((file) => file.id !== id)

    if (selectedFileId.value === id) selectedFileId.value = files.value[0]?.id ?? null
  }

  async function analyzeFile(id: string): Promise<void> {
    const file = files.value.find((file) => file.id === id)
    if (!file || file.status === 'analyzing') return

    file.status = 'analyzing'

    await new Promise<void>((res) => {
      window.setTimeout(res, 700)
    })
    file.status = 'completed'
    file.analysis = `已完成对《${file.name}》的模拟分析：文件内容结构清晰，建议继续结合 AI 聊天进行重点提取和风险梳理。`
  }

  return {
    files,
    selectedFileId,
    selectedFile,
    addFiles,
    selectFile,
    removeFile,
    analyzeFile,
  }
})
