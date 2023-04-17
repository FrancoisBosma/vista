import type { BlueprintElement, BlueprintNodeElement } from '@FEATURES/blueprint/types/'

type BpNodeId = BlueprintNodeElement['uuid']
interface BpNodeWrapper {
  bpRef: BlueprintElement
  children: Array<BpNodeId>
}

export default function useBlueprintNodeMap() {
  const blueprintNodeMap = ref(new Map<BpNodeId, BpNodeWrapper>())
  const registerNewBlueprintNode = (
    bpNodeId: BpNodeId,
    bpRef: BpNodeWrapper['bpRef'],
    parentBpNodeId: BpNodeId | undefined
  ) => {
    if (blueprintNodeMap.value.has(bpNodeId)) return printError('BlueprintNode is already part of the tree')
    const addNewNode = () => blueprintNodeMap.value.set(bpNodeId, { bpRef, children: [] })
    if (!parentBpNodeId) {
      if (blueprintNodeMap.value.size)
        return printError('First BlueprintNode is already part of the tree, did you forget to pass the parent arg ?')
      return addNewNode()
    }
    if (!blueprintNodeMap.value.has(parentBpNodeId)) return printError('Parent BlueprintNode could not be found')
    if (parentBpNodeId && blueprintNodeMap.value.get(parentBpNodeId)?.children.includes(bpNodeId))
      return printError('Parent BlueprintNode already references this BpNode')
    addNewNode()
    // add new node to its (already existing) parent
    blueprintNodeMap.value.get(parentBpNodeId)?.children.push(bpNodeId)
  }
  const applyDownwards = (nodeId: BpNodeId, fn: Function) => {
    const node = blueprintNodeMap.value.get(nodeId)
    if (!node) return
    fn(node)
    node.children.forEach((childNodeId) => applyDownwards(childNodeId, fn))
  }
  const updateBpSubtree = (nodeId: BpNodeId) => {
    applyDownwards(nodeId, (nodeWrapper: BpNodeWrapper) => nodeWrapper.bpRef.bpBounding.update())
  }

  return {
    registerNewBlueprintNode,
    updateBpSubtree,
  }
}
