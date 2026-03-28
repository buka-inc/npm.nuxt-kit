import type { MaybeRef } from 'vue'
import { computed, toRef } from 'vue'

export interface OffsetPaginationState {
  limit: MaybeRef<number>
  offset: MaybeRef<number>
  total: MaybeRef<number>
}

/**
 * Offset 分页展示层，将 limit/offset 转换为 page/pageSize/totalPages
 */
export function useOffsetPage(state: OffsetPaginationState) {
  const limit = toRef(state.limit)
  const offset = toRef(state.offset)
  const total = toRef(state.total)

  const page = computed({
    get: () => Math.floor(offset.value / limit.value) + 1,
    set: (val: number) => {
      offset.value = (val - 1) * limit.value
    },
  })

  const pageSize = computed({
    get: () => limit.value,
    set: (val: number) => {
      limit.value = val
    },
  })

  const totalPages = computed(() => (limit.value > 0 ? Math.ceil(total.value / limit.value) : 0),
  )

  return { page, pageSize, totalPages }
}
