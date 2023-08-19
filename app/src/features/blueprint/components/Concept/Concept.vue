<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import {
    bpNodeProvideKey,
    bpProvideKey,
  } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import type { Concept } from '@API/gql-generated/graphql'

  const { conceptName } = defineProps<{ conceptName: Concept['name'] }>()
  const { contentScale } = inject(bpProvideKey, { contentScale: ref(1) })
  const { depth: parentDepth } = inject(bpNodeProvideKey, { depth: 0 })

  const ui = useUiStore()
  const { fetchConcept } = useConceptStore()

  const closeConceptEl = ref(null) as Ref<HTMLElement | null>
  const { concept, isDone: isConceptFetched } = fetchConcept(conceptName)
  const isEmpty = eagerComputed(() => !concept.value.composition?.subConcepts.length)

  const { isHovered, isOpen, handleClick } = setManipulationHandling({ isEmpty, closeConceptEl })
  const styleKit = setStyleHandling({ isEmpty, isHovered, concept, isConceptFetched, contentScale, parentDepth })

  /**
   * DELETEME
   *
   * icons: screen-normal vs fit-screen
   *
   */
</script>

<template>
  <div class="concept" @click.stop="handleClick">
    <keep-alive>
      <CloseConcept
        v-if="!isOpen"
        ref="closeConceptEl"
        :concept="concept"
        :is-hovered="isHovered"
        :is-empty="isEmpty"
      />
      <template v-else>
        <Teleport :to="`#bp-${ui.getBlueprintTreeRoot()?.id}`">
          <div
            :style="{
              width: styleKit.dimensions.width,
              height: styleKit.dimensions.height,
              backgroundColor: styleKit.conceptBgColor,
              borderRadius: styleKit.conceptRoundness,
              transform: styleKit.bgDisplay.transform,
              left: styleKit.bgDisplay.left,
              top: styleKit.bgDisplay.top,
            }"
          />
        </Teleport>
        <OpenConcept :concept="concept" :is-empty="isEmpty" />
      </template>
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply select-none;
    cursor: v-bind('styleKit.cursor');
    width: v-bind('styleKit.dimensions.width');
    height: v-bind('styleKit.dimensions.height');

    & > * {
      @apply border-1;
      box-shadow: v-bind('styleKit.boxShadow');
      border-radius: v-bind('styleKit.conceptRoundness');
    }
  }
</style>
