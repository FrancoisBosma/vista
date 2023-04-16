import { acceptHMRUpdate, defineStore } from 'pinia'
import { useQuery } from 'villus'
import { ConceptQuery } from '@API/LogixAPI'
import type { Concept } from '@API/gql-generated/graphql'
import type { Ref } from 'vue'

export const useConceptStore = defineStore('Concept', () => {
  const fetchedConcepts: Ref<Map<Concept['name'], Concept>> = ref(new Map())
  const getStoreConcept = (conceptName: Concept['name']) => fetchedConcepts.value.get(conceptName)
  const saveStoreConcept = (conceptName: Concept['name'], newConcept: Concept) => {
    fetchedConcepts.value.set(conceptName, newConcept)
    if (!newConcept.composition?.subConcepts?.length) return
    newConcept.composition?.subConcepts.forEach((subConcept) => {
      if (getStoreConcept(subConcept.concept.name)) return
      fetchedConcepts.value.set(subConcept.concept.name, subConcept.concept)
    })
  }
  const fetchConcept = (conceptName: Concept['name']) => {
    const output = ref({ name: conceptName }) as Ref<Concept>
    const { isDone } = useQuery({
      query: ConceptQuery,
      variables: { conceptName },
      onData(data) {
        const requestedConcept = {
          name: conceptName,
          ...data.getConcept,
        } as Concept
        saveStoreConcept(conceptName, requestedConcept)
        output.value = requestedConcept
      },
    })
    return { concept: output, isDone }
  }

  return {
    fetchedConcepts,
    getStoreConcept,
    saveStoreConcept,
    fetchConcept,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useConceptStore, import.meta.hot))
