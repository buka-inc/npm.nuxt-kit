import { computed, ref } from 'vue'

export interface CursorPaginationMeta {
  total: number
  limit: number
  startCursor: string | null
  endCursor: string | null
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Cursor 分页数据层
 */
export function useCursorPagination(defaultPageSize = 20) {
  const pageSize = ref(defaultPageSize)
  const total = ref(0)
  const startCursor = ref<string | null>(null)
  const endCursor = ref<string | null>(null)
  const hasNextPage = ref(false)
  const hasPrevPage = ref(false)

  const nextPageParams = computed(() => ({
    first: pageSize.value,
    ...(endCursor.value ? { after: endCursor.value } : {}),
  }))

  const prevPageParams = computed(() => ({
    last: pageSize.value,
    ...(startCursor.value ? { before: startCursor.value } : {}),
  }))

  function apply(pagination?: CursorPaginationMeta) {
    if (!pagination) return
    total.value = pagination.total
    pageSize.value = pagination.limit
    startCursor.value = pagination.startCursor
    endCursor.value = pagination.endCursor
    hasNextPage.value = pagination.hasNextPage
    hasPrevPage.value = pagination.hasPrevPage
  }

  function reset() {
    startCursor.value = null
    endCursor.value = null
    hasNextPage.value = false
    hasPrevPage.value = false
  }

  return { pageSize, total, startCursor, endCursor, hasNextPage, hasPrevPage, nextPageParams, prevPageParams, apply, reset }
}
