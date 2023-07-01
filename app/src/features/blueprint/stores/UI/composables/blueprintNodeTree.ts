import type { BpNodeId, BpNodeWrapper } from '@FEATURES/blueprint/types/'

export default function useBlueprintNodeTree() {
  const blueprintNodeTree = ref(new Map<BpNodeId, BpNodeWrapper>())

  const getBlueprintTreeRoot = () => blueprintNodeTree.value.values().next().value as BpNodeWrapper | undefined
  const getBlueprintTreeNode = (id: BpNodeId) => blueprintNodeTree.value.get(id)

  const _addNewNode = (bpNodeId: BpNodeId, bpRef: BpNodeWrapper['bpRef'], parentBpNodeId?: BpNodeId) => {
    blueprintNodeTree.value.set(bpNodeId, { bpRef, childrenIds: [], parentId: parentBpNodeId })
    if (!parentBpNodeId) return
    blueprintNodeTree.value.get(parentBpNodeId)?.childrenIds.push(bpNodeId)
  }
  const registerNewBlueprintNode = (bpNodeId: BpNodeId, bpRef: BpNodeWrapper['bpRef'], parentBpNodeId?: BpNodeId) => {
    if (!blueprintNodeTree.value.size && parentBpNodeId)
      printError('BP tree is empty, where did you get that parent node ID ?')
    if (blueprintNodeTree.value.size && !parentBpNodeId)
      return printError('First BlueprintNode is already part of the tree, did you forget to pass the parent arg ?')
    if (!parentBpNodeId) return _addNewNode(bpNodeId, bpRef)
    if (!blueprintNodeTree.value.has(parentBpNodeId)) return printError('Parent BlueprintNode could not be found')
    if (blueprintNodeTree.value.get(parentBpNodeId)?.childrenIds.includes(bpNodeId))
      return printError('Parent BlueprintNode already references this BpNode')
    _addNewNode(bpNodeId, bpRef, parentBpNodeId)
  }

  const applyDownwards = (nodeId: BpNodeId, fn: Function) => {
    const node = blueprintNodeTree.value.get(nodeId)
    if (!node) return
    fn(node)
    node.childrenIds.forEach((childNodeId) => applyDownwards(childNodeId, fn))
  }

  const updateBpSubtree = (nodeId: BpNodeId) => {
    applyDownwards(nodeId, (nodeWrapper: BpNodeWrapper) => nodeWrapper.bpRef.bpBounding.update())
  }

  return {
    getBlueprintTreeRoot,
    getBlueprintTreeNode,
    registerNewBlueprintNode,
    updateBpSubtree,
  }
}
