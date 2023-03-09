import { acceptHMRUpdate, defineStore } from 'pinia'
import { ApiFetchFullConcept } from '@FEATURES/blueprint/api-requests/backend'
import { FetchStatus } from '@FEATURES/blueprint/types'
import type { Concept, FullConcept } from '@FEATURES/blueprint/types'
import type { Ref } from 'vue'

export const useConceptStore = defineStore('Concept', () => {
  const fetchedConcepts: Ref<Map<Concept['name'], Concept>> = ref(new Map())
  const getStoreConcept = (conceptName: Concept['name']) => fetchedConcepts.value.get(conceptName)
  const isConceptFullyFetched = (concept: Concept): concept is FullConcept => concept.fetchStatus === FetchStatus.full
  const saveStoreConcept = (conceptName: Concept['name'], newConcept: Concept) => {
    fetchedConcepts.value.set(conceptName, newConcept)
    if (!isConceptFullyFetched(newConcept)) return
    newConcept.composition?.subConcepts.forEach((subConcept) => {
      if (getStoreConcept(subConcept.concept.name)) return
      fetchedConcepts.value.set(subConcept.concept.name, {
        fetchStatus: FetchStatus.minimal,
        ...subConcept.concept,
      })
    })
  }
  const fetchConcept = (conceptName: Concept['name']): Ref<Concept> => {
    const output = ref({ name: conceptName }) as Ref<Concept>
    const AlreadyFetchedConcept = getStoreConcept(conceptName)
    if (!AlreadyFetchedConcept) saveStoreConcept(conceptName, output.value)
    else if (isConceptFullyFetched(AlreadyFetchedConcept)) return ref(AlreadyFetchedConcept)
    else output.value = AlreadyFetchedConcept

    const conceptFetchErrorReturn = () => {
      output.value.fetchStatus = FetchStatus.failure
    }

    output.value.fetchStatus = FetchStatus.loading
    const { getFetchedConcept, isFinished, error } = ApiFetchFullConcept(conceptName)
    whenever(isFinished, () => {
      if (error.value) return conceptFetchErrorReturn()
      const requestedConcept = getFetchedConcept()
      if (!requestedConcept) return conceptFetchErrorReturn()
      saveStoreConcept(conceptName, requestedConcept)
      output.value = requestedConcept
    })
    return output
  }

  return {
    fetchConcept,
    fetchedConcepts,
    isConceptFullyFetched,
    saveStoreConcept,
    getStoreConcept,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useConceptStore, import.meta.hot))
