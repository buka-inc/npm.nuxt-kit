import { ref } from 'vue'

export interface OffsetPaginationMeta {
  total: number
  limit: number
  offset: number
}

/**
 * Offset 分页数据层，维护 limit/offset/total
 */
export function useOffsetPagination(defaultPageSize = 20) {
  const limit = ref(defaultPageSize)
  const offset = ref(0)
  const total = ref(0)

  /**
   * 应用 API 响应的分页元数据，同步 total/limit/offset
   */
  function apply(pagination?: OffsetPaginationMeta) {
    if (!pagination) return
    total.value = pagination.total
    limit.value = pagination.limit
    offset.value = pagination.offset
  }

  function reset() {
    offset.value = 0
  }

  return { limit, offset, total, apply, reset }
}
