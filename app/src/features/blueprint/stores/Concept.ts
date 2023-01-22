import { acceptHMRUpdate, defineStore } from 'pinia'
import { ApiFetchFullConcept, REQUEST_TIMEOUT } from '@FEATURES/blueprint/api-requests/backend'
import type { Concept } from '@FEATURES/blueprint/types'
import type { Ref } from 'vue'

export const useConceptStore = defineStore('Concept', () => {
  const fetchedConcepts: Ref<Map<Concept['name'], Concept>> = ref(new Map())
  const tryAndGetAlreadyFetchedConcept = (conceptName: Concept['name']) => fetchedConcepts.value.get(conceptName)
  const isConceptFullyFetched = (concept: Concept) => 'arguments' in concept
  const locallySaveConcept = (conceptName: Concept['name'], newConcept: Concept) =>
    fetchedConcepts.value.set(conceptName, newConcept)
  const fetchConcept = async (conceptName: Concept['name']): Promise<Concept | undefined> => {
    const errorReturn = () => undefined
    const handleRequest = async (req: typeof ApiFetchFullConcept) => {
      const { getFetchedConcept, isFinished, error } = req(conceptName)
      await until(isFinished).toBe(true, { timeout: REQUEST_TIMEOUT })
      if (error.value) return errorReturn()
      const requestedConceptData = getFetchedConcept()
      if (!requestedConceptData) return errorReturn()
      const requestedConcept = {
        name: conceptName,
        ...requestedConceptData,
      }
      locallySaveConcept(conceptName, requestedConcept)
      return requestedConcept
    }
    const AlreadyFetchedConcept = tryAndGetAlreadyFetchedConcept(conceptName)
    if (!AlreadyFetchedConcept) {
      return handleRequest(ApiFetchFullConcept)
    }
    if (isConceptFullyFetched(AlreadyFetchedConcept)) return AlreadyFetchedConcept
    // TODO: handle that case knowing the handleRequest() return value will be missing part(s)
  }

  return {
    fetchConcept,
    fetchedConcepts,
    isConceptFullyFetched,
    tryAndGetAlreadyFetchedConcept,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useConceptStore, import.meta.hot))
