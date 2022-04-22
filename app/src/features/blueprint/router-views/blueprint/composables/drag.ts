import type { setCommonHandling } from './'
import type { DragState } from '../types'

interface DragSetterArguments {
  updateContentOffsets: ReturnType<typeof setCommonHandling>['updateContentOffsets']
}

export default function setDragHandling({ updateContentOffsets }: DragSetterArguments) {
  const handleDrag = ({ delta }: DragState) => {
    updateContentOffsets({ width: delta[0], height: delta[1] })
  }

  return {
    handleDrag,
  }
}
