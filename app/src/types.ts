import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void
export interface Concept {
  title: String
  subTiles: Concept[]
}
