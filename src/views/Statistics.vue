<template>
  <div class="statistics-page">
    <div class="page-header">
      <div>
        <h1>数据统计</h1>
        <p>查看工作流、AI 对话和文件处理的使用情况。</p>
      </div>
    </div>

    <NGrid cols="1 s:2 m:2 l:4" x-gap="16" y-gap="16">
      <NGridItem>
        <NCard>
          <NStatistic label="工作流总数" :value="workflowStore.workflows.length" />
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard>
          <NStatistic label="累计运行次数" :value="totalWorkflowRuns" />
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard>
          <NStatistic label="聊天消息数量" :value="totalMessages" />
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard>
          <NStatistic label="已分析文件" :value="completedFileCount" />
        </NCard>
      </NGridItem>
    </NGrid>

    <NCard title="近 7 天 AI 使用趋势">
      <ChartPanel :labels="trendLabels" :values="trendValues" series-name="AI 调用次数" />
    </NCard>

    <NGrid class="statistics-content" cols="1 m:2" x-gap="16" y-gap="16">
      <NGridItem>
        <NCard title="工作流使用排行">
          <NEmpty v-if="topWorkflows.length === 0" description="暂时没有工作流数据" />

          <NList v-else>
            <NListItem v-for="(workflow, index) in topWorkflows" :key="workflow.id">
              <div class="workflow-item">
                <div class="workflow-info">
                  <span class="ranking">{{ index + 1 }}</span>

                  <div>
                    <strong>{{ workflow.name }}</strong>
                    <p>{{ workflow.category }}</p>
                  </div>
                </div>

                <NTag type="success" size="small">
                  {{ workflow.runCount }} 次运行
                </NTag>
              </div>
            </NListItem>
          </NList>
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard title="使用概览">
          <div class="overview-item">
            <span>聊天会话</span>
            <strong>{{ chatStore.sessions.length }} 个</strong>
          </div>

          <div class="overview-item">
            <span>已上传文件</span>
            <strong>{{ fileStore.files.length }} 个</strong>
          </div>

          <div class="overview-item">
            <span>待分析文件</span>
            <strong>{{ readyFileCount }} 个</strong>
          </div>

          <div class="overview-item">
            <span>收藏工作流</span>
            <strong>{{ workflowStore.favoriteWorkflows.length }} 个</strong>
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard,
  NEmpty,
  NGrid,
  NGridItem,
  NList,
  NListItem,
  NStatistic,
  NTag,
} from 'naive-ui'
import { useChatStore } from '@/stores/chat'
import { useFileStore } from '@/stores/file'
import { useWorkflowStore } from '@/stores/workflow'
import ChartPanel from '@/components/ChartPanel.vue'

const workflowStore = useWorkflowStore()
const chatStore = useChatStore()
const fileStore = useFileStore()

const trendLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const trendValues = [12, 18, 14, 21, 16, 25, 30]

const totalWorkflowRuns = computed(() => {
  return workflowStore.workflows.reduce((total, workflow) => {
    return total + workflow.runCount
  }, 0)
})

const totalMessages = computed(() => {
  return chatStore.sessions.reduce((total, session) => {
    return total + session.messages.length
  }, 0)
})

const completedFileCount = computed(() => {
  return fileStore.files.filter((file) => file.status === 'completed').length
})

const readyFileCount = computed(() => {
  return fileStore.files.filter((file) => file.status === 'ready').length
})

const topWorkflows = computed(() => {
  return [...workflowStore.workflows]
    .sort((first, second) => second.runCount - first.runCount)
    .slice(0, 3)
})
</script>

<style scoped>
.statistics-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 8px 0 0;
  color: #64748b;
}

.statistics-content {
  margin-top: 4px;
}

.workflow-item,
.workflow-info,
.overview-item {
  display: flex;
  align-items: center;
}

.workflow-item,
.overview-item {
  justify-content: space-between;
  gap: 16px;
}

.workflow-info {
  gap: 12px;
}

.ranking {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
}

.workflow-info strong {
  color: #334155;
}

.workflow-info p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.overview-item {
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
}

.overview-item:last-child {
  border-bottom: 0;
}

.overview-item strong {
  color: #334155;
}
</style>
