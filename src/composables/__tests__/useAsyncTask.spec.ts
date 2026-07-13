import { describe, it, expect, vi } from 'vitest'
import { useAsyncTask } from '../useAsyncTask'

describe('useAsyncTask', () => {
  it('应正确更新异步任务的加载和成功状态', async () => {
    const task = vi.fn<(value: string) => Promise<string>>(async (value: string) => value.toUpperCase())
    const asyncTask = useAsyncTask(task)

    expect(asyncTask.status.value).toBe('idle')
    expect(asyncTask.isLoading.value).toBe(false)
    expect(asyncTask.data.value).toBe(null)

    const resultPromise = asyncTask.execute('sakiflow')

    expect(asyncTask.status.value).toBe('loading')
    expect(asyncTask.isLoading.value).toBe(true)

    const result = await resultPromise

    expect(result).toBe('SAKIFLOW')
    expect(asyncTask.data.value).toBe('SAKIFLOW')
    expect(asyncTask.status.value).toBe('success')
    expect(asyncTask.isLoading.value).toBe(false)
    expect(asyncTask.error.value).toBeNull()
    expect(task).toHaveBeenCalledOnce()
  })

  it('应捕获异步任务错误并更新失败状态', async () => {
    const task = vi.fn<() => Promise<void>>(async () => {
      throw new Error('AI 请求失败')
    })

    const asyncTask = useAsyncTask(task)
    const result = await asyncTask.execute()

    expect(result).toBeNull()
    expect(asyncTask.status.value).toBe('error')
    expect(asyncTask.error.value).toBe('AI 请求失败')
    expect(asyncTask.isLoading.value).toBe(false)
  })
})
