import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 工作流种类
export type WorkflowCategory = '代码开发' | '文档处理' | '学习辅助'

// 工作流完整业务数据
export interface Workflow {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  prompt: string
  isFavorite: boolean
  updatedAt: string
  runCount: number
}

//新建或编辑工作流时可填写的字段
export type WorkflowDraft = Pick<Workflow, 'name' | 'description' | 'category' | 'prompt'>

export const useWorkflowStore = defineStore('workflow', () => {
  const workflows = ref<Workflow[]>([
    {
      id: 'workflow-code-review',
      name: '前端代码审查助手',
      description: '分析 Vue 与 TypeScript 代码，给出可执行的优化建议。',
      category: '代码开发',
      prompt: '请审查以下前端代码，并按优先级给出问题和优化建议。',
      isFavorite: true,
      updatedAt: '10 分钟前',
      runCount: 48,
    },
    {
      id: 'workflow-document-summary',
      name: '技术文档总结助手',
      description: '快速提炼长文档的重点、风险与待办事项。',
      category: '文档处理',
      prompt: '请总结以下文档，输出核心结论、风险和下一步行动。',
      isFavorite: false,
      updatedAt: '昨天',
      runCount: 32,
    },
    {
      id: 'workflow-study-plan',
      name: '学习辅助助手',
      description: '根据学习目标生成可执行的阶段计划。',
      category: '学习辅助',
      prompt: '请根据我的目标和可用时间生成学习计划。',
      isFavorite: true,
      updatedAt: '3 天前',
      runCount: 19,
    },
  ])

  const favoriteWorkflows = computed(() =>
    workflows.value.filter((workflow) => workflow.isFavorite),
  )

  // 创建一个带有默认元数据的新工作流
  function createWorkflow(draft: WorkflowDraft): void {
    workflows.value.unshift({
      ...draft,
      id: `workflow-${Date.now()}`,
      isFavorite: false,
      updatedAt: '刚刚',
      runCount: 0,
    })
  }

  // 按ID更新指定工作流的可编辑字段
  function updateWorkflow(id: string, draft: WorkflowDraft): void {
    const workflow = workflows.value.find((workflow) => workflow.id === id)
    if (workflow) {
      Object.assign(workflow, draft, { updatedAt: '刚刚' })
    }
  }

  // 切换工作流的收藏状态
  function toggleFavorite(id: string): void {
    const workflow = workflows.value.find((workflow) => workflow.id === id)

    if (workflow) {
      workflow.isFavorite = !workflow.isFavorite
    }
  }

  function removeWorkflow(id: string): void {
    workflows.value = workflows.value.filter((workflow) => workflow.id !== id)
  }

  return {
    workflows,
    favoriteWorkflows,
    createWorkflow,
    updateWorkflow,
    toggleFavorite,
    removeWorkflow,
  }
})
