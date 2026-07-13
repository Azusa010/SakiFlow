<template>
  <div ref="chartContainer" class="chart-panel"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, watch,ref } from 'vue';

interface ChartPanelProps {
  // 横轴标签
  labels: string[];
  // 数据值
  values: number[];
  seriesName?: string;
}

const props = withDefaults(defineProps<ChartPanelProps>(), {
  seriesName: '使用次数'
})

// ECharts 挂载节点
const chartContainer = ref<HTMLElement | null>(null)

let chart: echarts.ECharts | null = null

let resizeObserver: ResizeObserver | null = null

function renderChart(): void {
  if (!chart) return
  chart.setOption(
    {
      color: ['#2563eb'],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 24,
        right: 24,
        bottom: 28,
        left: 42,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.labels,
        axisLine: {
          lineStyle: { color: '#cbd5e1' }
        },
        axisLabel: {
          color: '#64748b'
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: { color: '#e2e8f0' },
        },
        axisLabel: {
          color: '#64748b',
        },
      },
      series: [
        {
          name: props.seriesName,
          type: 'line',
          data: props.values,
          smooth: true,
          areaStyle: {
            color: 'rgba(37, 99, 235, 0.2)',
          }
        }
      ]
    },
    true,
  )
}

onMounted(()=>{
  const container = chartContainer.value
  if(!container) return

  chart = echarts.init(container)
  renderChart()

  resizeObserver = new ResizeObserver(()=>{
    chart?.resize()
  })

  resizeObserver.observe(container)
})


watch(()=>[props.labels,props.values],()=>{
  renderChart()
},{deep:true})

onBeforeUnmount(()=>{
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})



</script>

<style scoped>
.chart-panel {
  width: 100%;
  height: 320px;
}
</style>
