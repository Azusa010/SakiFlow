<template>
  <NCard :title="workflow.name" class="workflow-card">
    <template #header-extra>
      <NTag size="small" :bordered="false">{{ workflow.category }}</NTag>
    </template>

    <p class="workflow-description">{{ workflow.description }}</p>

    <div class="workflow-meta">
      <span>运行 {{ workflow.runCount }} 次</span>
      <span>更新于 {{ workflow.updatedAt }}</span>
    </div>

    <template #action>
      <div class="workflow-actions">
        <NButton size="small" type="primary" @click="emitRun">运行</NButton>
        <NButton size="small" @click="emitEdit">编辑</NButton>
        <NButton size="small" @click="emitToggleFavorite">{{ workflow.isFavorite ? '取消收藏' : '收藏' }}</NButton>
        <NButton size="small" type="error" @click="emitRemove">删除</NButton>
      </div>
    </template>
  </NCard>
</template>
<script setup lang="ts">
import { NButton, NCard, NTag } from 'naive-ui';
import type { Workflow } from '@/stores/workflow';

// 接收的外部数据
interface WorkflowCardProps {
  workflow: Workflow;
}
const props = defineProps < WorkflowCardProps > ();


// 卡片向父页面发送的业务操作
const emit = defineEmits < {
  run: [id: string]
  edit: [id: string]
  'toggle-favorite': [id: string]
  remove: [id: string]
} > ()

// 通知父页面运行当前工作流
function emitRun():void{
  emit('run', props.workflow.id);
}

// 通知父页面编辑当前工作流
function emitEdit():void{
  emit('edit', props.workflow.id);
}

// 通知父页面切换当前工作流的收藏状态
function emitToggleFavorite():void{
  emit('toggle-favorite', props.workflow.id);
}

// 通知父页面删除当前工作流
function emitRemove():void{
  emit('remove', props.workflow.id);
}
</script>


<style scoped>
.workflow-card {
  height: 100%;
}

.workflow-description {
  min-height: 44px;
  margin: 0;
color: var(--text-secondary);
  line-height: 1.6;
}

.workflow-meta,
.workflow-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workflow-meta {
  margin-top: 18px;
color: var(--text-muted);
  font-size: 13px;
}

.workflow-actions {
  flex-wrap: wrap;
}
</style>
