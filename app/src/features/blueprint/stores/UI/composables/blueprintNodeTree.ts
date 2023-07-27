import type { BpNodeId, BpNodeWrapper } from '@FEATURES/blueprint/types/'

export default function useBlueprintNodeTree() {
  const blueprintNodeTree = ref(new Map<BpNodeId, BpNodeWrapper>())

  const getBlueprintTreeRoot = () => blueprintNodeTree.value.values().next().value as BpNodeWrapper | undefined
  const getBlueprintTreeNode = (id: BpNodeId) => blueprintNodeTree.value.get(id)

  const _addNewNode = (bpNodeId: BpNodeId, bpRef: BpNodeWrapper['bpRef'], parentBpNodeId?: BpNodeId) => {
    blueprintNodeTree.value.set(bpNodeId, { id: bpNodeId, bpRef, childrenIds: [], parentId: parentBpNodeId })
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

  return {
    getBlueprintTreeRoot,
    getBlueprintTreeNode,
    registerNewBlueprintNode,
  }
}
