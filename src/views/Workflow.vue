<template>
  <div class="workflow-page">
    <NPageHeader title="工作流管理" subtitle="创建并管理你的AI工作流">
      <template #extra>
        <NButton type="primary" @click="openCreateModal">新建工作流</NButton>
      </template>
    </NPageHeader>

    <div class="workflow-filter">
      <NInput v-model:value="searchKeyword" class="workflow-search" placeholder="搜索工作流名称或描述" clearable />

      <NSelect v-model:value="selectedCategory" :options="categoryOptions" placeholder="全部分类" clearable
        class="category-filter" />
      <NCheckbox v-model:checked="favoriteOnly">只看收藏</NCheckbox>
    </div>

    <NEmpty v-if="workflowStore.workflows.length === 0" description="还没有工作流，先创建一个吧" class="empty-state" />
    <NEmpty v-else-if="filteredWorkflows.length === 0" description="当前筛选条件下没有工作流" class="empty-state"></NEmpty>

    <NGrid v-else cols="1 s:2 m:2 l:3" :x-gap="16" :y-gap="16" responsive="screen">
      <NGridItem v-for="workflow in filteredWorkflows" :key="workflow.id">
        <WorkflowCard :workflow="workflow" @run="handleRun" @toggle-favorite="workflowStore.toggleFavorite"
          @remove="workflowStore.removeWorkflow" @edit="openEditModal" />
      </NGridItem>
    </NGrid>


    <NModal v-model:show="showCreateModal" preset="card" :title="editingWorkflowId ? '编辑工作流' : '新建工作流'"
      style="width: min(560px,calc(100vw - 32px));">
      <NForm ref="formRef" :model="formValue" :rules="createRules">
        <NFormItem label="名称" path="name">
          <NInput v-model:value="formValue.name" placeholder="例如: 前端代码审查助手" />
        </NFormItem>

        <NFormItem label="分类">
          <NSelect v-model:value="formValue.category" :options="categoryOptions" />
        </NFormItem>
        <NFormItem label="描述" path="description">
          <NInput v-model:value="formValue.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入工作流描述" />
        </NFormItem>

        <NFormItem label="提示词" path="prompt">
          <NInput v-model:value="formValue.prompt" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入提示词" />

        </NFormItem>
        <NButton type="primary" block @click="handleCreate">{{ editingWorkflowId ? '编辑工作流' : '新建工作流' }}</NButton>
      </NForm>

    </NModal>
  </div>
</template>

<script setup lang="ts">
import { type WorkflowDraft, useWorkflowStore } from '@/stores/workflow';
import { useRouter } from 'vue-router';
import WorkflowCard from '@/components/WorkflowCard.vue';
import { type FormRules, type FormInst, NButton, NEmpty, NGrid, NGridItem, NModal, NPageHeader, NForm, NFormItem, NInput, NSelect, NCheckbox } from 'naive-ui';
import { reactive, ref, computed } from 'vue';
import { refDebounced } from '@vueuse/core';


const workflowStore = useWorkflowStore();
const router = useRouter();
const showCreateModal = ref(false);
const editingWorkflowId = ref<string | null>(null);
const formRef = ref<FormInst | null>(null);

const formValue = reactive<WorkflowDraft>({
  name: '',
  description: '',
  category: '代码开发',
  prompt: '',
})

const categoryOptions = [
  { label: '代码开发', value: '代码开发' },
  { label: '文档处理', value: '文档处理' },
  { label: '学习辅助', value: '学习辅助' },
]

const searchKeyword = ref('')

const debouncedSearchKeyword = refDebounced(searchKeyword, 300)


const selectedCategory = ref<string | null>(null);

const favoriteOnly = ref(false);

const filteredWorkflows = computed(() => {
  const keyword = debouncedSearchKeyword.value.trim().toLocaleLowerCase()
  return workflowStore.workflows.filter(workflow => {
    const matchesSearch = !keyword || workflow.name.toLowerCase().includes(keyword) || workflow.description.toLowerCase().includes(keyword)

    const matchesCategory = !selectedCategory.value || workflow.category === selectedCategory.value

    const mathcesFavorite = !favoriteOnly.value || workflow.isFavorite
    return matchesCategory && mathcesFavorite && matchesSearch
  })
})

// 表单验证规则
const createRules: FormRules = {
  name: [{ required: true, message: '请输入工作流名称', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入工作流描述', trigger: 'blur' },
  ],
  prompt: [{ required: true, message: '请输入提示词', trigger: 'blur' }],
}


function handleRun(id: string): void {
  workflowStore.runWorkflow(id)
  void router.push({ name: 'Chat', query: { workflowId: id } })
}


// 打开创建工作流的弹窗
function openCreateModal(): void {
  editingWorkflowId.value = null
  Object.assign(formValue, {
    name: '',
    description: '',
    category: '代码开发',
    prompt: ''
  })

  showCreateModal.value = true;
}

function openEditModal(id: string): void {
  const workflow = workflowStore.workflows.find(workflow => workflow.id === id)

  if (!workflow) return

  editingWorkflowId.value = id

  Object.assign(formValue, {
    name: workflow.name,
    description: workflow.description,
    category: workflow.category,
    prompt: workflow.prompt
  })

  showCreateModal.value = true;
}

async function handleCreate(): Promise<void> {
  await formRef.value?.validate()

  if (editingWorkflowId.value) {
    workflowStore.updateWorkflow(editingWorkflowId.value, formValue)
  } else {
    workflowStore.createWorkflow(formValue)
  }

  showCreateModal.value = false
}



</script>



<style scoped>
.workflow-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state {
  padding: 64px 0;
}

.workflow-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.category-filter {
  width: min(240px, 100%);
}

.workflow-search {
  width: min(320px, 100%);
}
</style>
