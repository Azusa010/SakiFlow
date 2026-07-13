<template>
  <div ref="chartContainer" class="chart-panel"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, watch, ref } from 'vue';

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

let themeObserver: MutationObserver | null = null

function renderChart(): void {
  if (!chart) return
  const rootStyles = getComputedStyle(document.documentElement)
  const textColor = rootStyles.getPropertyValue('--text-secondary').trim()
  const primaryTextColor = rootStyles.getPropertyValue('--text-primary').trim()
  const borderColor = rootStyles.getPropertyValue('--border-color').trim()
  const surfaceColor = rootStyles.getPropertyValue('--surface-color').trim()
  chart.setOption(
    {
      color: ['#2563eb'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: surfaceColor,
        borderColor,
        textStyle: {
          color: primaryTextColor,
        },
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
          lineStyle: { color: borderColor }
        },
        axisLabel: {
          color: textColor,
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: { color: borderColor },
        },
        axisLabel: {
          color: textColor,
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

onMounted(() => {
  const container = chartContainer.value
  if (!container) return

  chart = echarts.init(container)
  renderChart()

  resizeObserver = new ResizeObserver(() => {
    chart?.resize()
  })

  resizeObserver.observe(container)

  themeObserver = new MutationObserver(()=>{
    renderChart()
  })

  themeObserver.observe(document.documentElement,{
    attributes: true,
    attributeFilter: ['data-theme']
  })
})


watch(() => [props.labels, props.values], () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
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
