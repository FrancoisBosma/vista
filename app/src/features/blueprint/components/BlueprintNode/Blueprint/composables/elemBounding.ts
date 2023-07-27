interface ZoomSetterArguments {
  bp: Ref<HTMLElement | null>
  isRootBp: boolean
}

export default function setElemBoundingHandling({ bp, isRootBp }: ZoomSetterArguments) {
  const boundingRect = ref<DOMRect | undefined>(undefined)
  if (isRootBp) {
    watchOnce(bp, () => (boundingRect.value = bp.value?.getBoundingClientRect()))
  }

  return {
    boundingRect,
  }
}
