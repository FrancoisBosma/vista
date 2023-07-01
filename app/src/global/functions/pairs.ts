import type { Pair } from '@SRC/types'

export const getNumbersFromPair = (pair?: Pair<number>) => pair?.split(':').map((s) => Number(s))
