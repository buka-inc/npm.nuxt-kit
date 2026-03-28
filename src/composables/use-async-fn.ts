import { ref } from 'vue'

/**
 * 通用异步函数执行辅助，追踪 pending 和 error 状态
 */
export function useAsyncFn<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => PromiseLike<TResult>,
) {
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function execute(...args: TArgs) {
    pending.value = true
    error.value = null
    try {
      const data = await fn(...args)
      return { success: true as const, data }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('未知错误')
      error.value = err
      return { success: false as const, error: err }
    } finally {
      pending.value = false
    }
  }

  return { pending, error, execute }
}
