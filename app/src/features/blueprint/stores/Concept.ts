import { acceptHMRUpdate, defineStore } from 'pinia'
import { ApiFetchFullConcept, REQUEST_TIMEOUT } from '@FEATURES/blueprint/api-requests/backend'
import type { Concept } from '@FEATURES/blueprint/types'
import type { Ref } from 'vue'

type ConceptFetchError = undefined

export const useConceptStore = defineStore('Concept', () => {
  const fetchedConcepts: Ref<Map<Concept['name'], Concept>> = ref(new Map())
  const tryAndGetAlreadyFetchedConcept = (conceptName: Concept['name']) => fetchedConcepts.value.get(conceptName)
  const isConceptFullyFetched = (concept: Concept) => 'arguments' in concept
  const locallySaveConcept = (conceptName: Concept['name'], newConcept: Concept) =>
    fetchedConcepts.value.set(conceptName, newConcept)

  const fetchConcept = async (conceptName: Concept['name']): Promise<Concept | ConceptFetchError> => {
    const AlreadyFetchedConcept = tryAndGetAlreadyFetchedConcept(conceptName)
    if (AlreadyFetchedConcept && isConceptFullyFetched(AlreadyFetchedConcept)) return AlreadyFetchedConcept
    const conceptFetchErrorReturn = () => undefined as ConceptFetchError
    const { getFetchedConcept, isFinished, error } = ApiFetchFullConcept(conceptName)
    await until(isFinished).toBe(true, { timeout: REQUEST_TIMEOUT })
    if (error.value) return conceptFetchErrorReturn()
    const requestedConcept = getFetchedConcept()
    if (!requestedConcept) return conceptFetchErrorReturn()
    locallySaveConcept(conceptName, requestedConcept)
    return requestedConcept
  }

  return {
    fetchConcept,
    fetchedConcepts,
    isConceptFullyFetched,
    locallySaveConcept,
    tryAndGetAlreadyFetchedConcept,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useConceptStore, import.meta.hot))
