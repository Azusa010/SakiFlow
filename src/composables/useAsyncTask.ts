import { computed, ref, type ComputedRef, type Ref } from 'vue'

// 异步任务可能的状态
export type AsyncTaskStatus = 'idle' | 'loading' | 'success' | 'error'

//  通用异步任务状态和操作方法
export interface AsyncTaskState<TArgs extends unknown[], TResult> {
  status: Ref<AsyncTaskStatus>
  data: Ref<TResult | null>
  error: Ref<string | null>
  isLoading: ComputedRef<boolean>
  execute: (...args: TArgs) => Promise<TResult | null>
  reset: () => void
}

// 统一管理异步任务的加载、成功、失败状态
export function useAsyncTask<TArgs extends unknown[], TResult>(
  task: (...args: TArgs) => Promise<TResult>,
): AsyncTaskState<TArgs, TResult> {
  const status = ref<AsyncTaskStatus>('idle')
  const data = ref<TResult | null>(null) as Ref<TResult | null>
  const error = ref<string | null>(null)

  // 是否正在执行
  const isLoading = computed(() => status.value === 'loading')

  // 执行异步任务并自动更新请求状态
  async function execute(...args: TArgs): Promise<TResult | null> {
    if (isLoading.value) {
      return null
    }

    status.value = 'loading'
    error.value = null

    try {
      const result = await task(...args)
      data.value = result
      status.value = 'success'
      return result
    } catch (reason: unknown) {
      error.value = reason instanceof Error ? reason.message : '请求失败,请稍后重试'
      status.value = 'error'
      return null
    }
  }

  function reset(): void {
    status.value = 'idle'
    data.value = null
    error.value = null
  }

  return {
    status,
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}
