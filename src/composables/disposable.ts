/**
 * 将一个函数包装为"只执行一次"的 composable：
 * - 首次调用时执行 `fn`，并将返回值缓存
 * - 后续任意次调用均直接返回缓存值，`fn` 不会再次执行
 * - 对异步函数同样适用：多次调用会返回同一个 `Promise` 实例，
 *   不会触发多次异步操作
 *
 * @param fn - 需要被包装的原始函数
 * @returns 包装后的函数，调用签名与 `fn` 完全相同，但保证只执行一次
 *
 * @example
 * // 同步场景：初始化只执行一次
 * const initConfig = disposable(() => {
 *   console.log('initializing...')
 *   return { theme: 'dark', lang: 'zh-CN' }
 * })
 *
 * const cfg1 = initConfig() // 打印 "initializing..."，返回 { theme: 'dark', lang: 'zh-CN' }
 * const cfg2 = initConfig() // 不打印任何内容，直接返回缓存值
 * console.log(cfg1 === cfg2) // true
 *
 * @example
 * // 异步场景：防止重复发起请求
 * const fetchUser = disposable(async (id: number) => {
 *   const res = await fetch(`/api/users/${id}`)
 *   return res.json()
 * })
 *
 * const p1 = fetchUser(42) // 发起一次网络请求
 * const p2 = fetchUser(42) // 直接返回同一个 Promise，不会再次请求
 * console.log(p1 === p2)   // true
 */
export function disposable<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R {
  let called = false
  let cachedResult: R

  return (...args: Args): R => {
    if (!called) {
      called = true
      cachedResult = fn(...args)
    }
    return cachedResult
  }
}
