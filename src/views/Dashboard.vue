<template>
  <div class="dashboard-page">
    <section class="dashboard-hero">
      <h1>你好,{{ displayName }}</h1>
      <p>这是你的 AI 工作台， 继续推进今天的工作吧 </p>
    </section>
    <NGrid cols="1 s:2 m:2 l:4" :x-gap="16" :y-gap="16" responsive="screen">
      <NGridItem v-for="metric in metrics" :key="metric.label">
        <NCard>
          <NStatistic :label="metric.label" :value="metric.value" />
          <p class="metric-description">{{ metric.description }}</p>
        </NCard>
      </NGridItem>
    </NGrid>

    <NCard title="最近任务" class="recent-task-card">
      <NList hoverable>
        <NListItem v-for="task in recentTasks" :key="task.title">
          <div class="task-row">
            <div>
              <strong>{{ task.title }}</strong>
              <p>{{ task.workflow }} · {{ task.time }} </p>
            </div>
            <NTag :type="task.status === '进行中' ? 'warning' : 'success'">
              {{ task.status }}
            </NTag>
          </div>
        </NListItem>
      </NList>
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { NCard, NGrid, NGridItem, NList, NListItem, NStatistic, NTag } from "naive-ui";

// 统计指标
interface DashboardMetric {
  label: string;
  value: string;
  description: string;
}

// 最近任务
interface RecentTask {
  title: string,
  workflow: string,
  time: string
  status: '进行中' | '已完成'
}


const userStore = useUserStore()

const displayName = computed(() => userStore.userInfo?.nickname || '开发者')

// 统计数据
const metrics: DashboardMetric[] = [
  { label: 'AI 调用次数', value: '128', description: '较上周增长 18%' },
  { label: '活跃工作流', value: '6', description: '当前可直接使用' },
  { label: '已分析文件', value: '24', description: '本月累计上传' },
  { label: 'Token 消耗', value: '86.5K', description: '本月累计消耗' },
]

const recentTasks: RecentTask[] = [
  {
    title: '分析 Vue 组件性能问题',
    workflow: '前端代码审查助手',
    time: '10 分钟前',
    status: '进行中',
  },
  {
    title: '总结产品需求说明书',
    workflow: '技术文档总结助手',
    time: '1 小时前',
    status: '已完成',
  },
  {
    title: '生成本周学习计划',
    workflow: '学习辅助助手',
    time: '昨天',
    status: '已完成',
  },
]

</script>


<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-hero {
  padding: 28px 32px;
  border-radius: 12px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}

.dashboard-hero h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.dashboard-hero p,
.metric-description,
.task-row p {
  margin: 0;
}

.dashboard-hero p {
  color: rgba(255, 255, 255, 0.82);
}

.metric-description {
  margin-top: 10px;
  color: #909399;
  font-size: 13px;
}

.recent-task-card {
  margin-top: 8px;
}

.task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-row p {
  margin-top: 6px;
  color: #909399;
  font-size: 13px;
}
</style>
