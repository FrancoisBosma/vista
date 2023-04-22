import type { BpNodeId, BpNodeWrapper } from '@FEATURES/blueprint/types/'

export default function useBlueprintNodeMap() {
  const blueprintNodeMap = ref(new Map<BpNodeId, BpNodeWrapper>())

  const getBlueprintTreeHead = () => blueprintNodeMap.value.values().next().value as BpNodeWrapper | undefined
  const getBlueprintTreeNode = (id: BpNodeId) => blueprintNodeMap.value.get(id)

  const _addNewNode = (bpNodeId: BpNodeId, bpRef: BpNodeWrapper['bpRef'], parentBpNodeId?: BpNodeId) => {
    blueprintNodeMap.value.set(bpNodeId, { bpRef, childrenIds: [], parentId: parentBpNodeId })
    if (!parentBpNodeId) return
    blueprintNodeMap.value.get(parentBpNodeId)?.childrenIds.push(bpNodeId)
  }
  const registerNewBlueprintNode = (bpNodeId: BpNodeId, bpRef: BpNodeWrapper['bpRef'], parentBpNodeId?: BpNodeId) => {
    if (!blueprintNodeMap.value.size && parentBpNodeId)
      printError('BP tree is empty, where did you get that parent node ID ?')
    if (blueprintNodeMap.value.size && !parentBpNodeId)
      return printError('First BlueprintNode is already part of the tree, did you forget to pass the parent arg ?')
    if (!parentBpNodeId) return _addNewNode(bpNodeId, bpRef)
    if (!blueprintNodeMap.value.has(parentBpNodeId)) return printError('Parent BlueprintNode could not be found')
    if (blueprintNodeMap.value.get(parentBpNodeId)?.childrenIds.includes(bpNodeId))
      return printError('Parent BlueprintNode already references this BpNode')
    _addNewNode(bpNodeId, bpRef, parentBpNodeId)
  }

  const applyDownwards = (nodeId: BpNodeId, fn: Function) => {
    const node = blueprintNodeMap.value.get(nodeId)
    if (!node) return
    fn(node)
    node.childrenIds.forEach((childNodeId) => applyDownwards(childNodeId, fn))
  }

  const updateBpSubtree = (nodeId: BpNodeId) => {
    applyDownwards(nodeId, (nodeWrapper: BpNodeWrapper) => nodeWrapper.bpRef.bpBounding.update())
  }

  return {
    getBlueprintTreeHead,
    getBlueprintTreeNode,
    registerNewBlueprintNode,
    updateBpSubtree,
  }
}
