import { acceptHMRUpdate, defineStore } from 'pinia'
import { FetchStatus } from '@FEATURES/blueprint/types'
import { useQuery } from 'villus'
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
    const conceptQuery = `
      query ($conceptName: String!) {
        getConcept(name: $conceptName) {
          arguments {name capacity}
          composition {
            subConcepts {
              concept { name composition { subConcepts { concept {name} } }}
              xy
              wh
            }
            connections {
              sourceCustomID
              sourceArgumentType {name}
              targetConceptType
              targetConceptCustomID
              targetConceptArgumentType {name}
            }
          }
        }
      }
    `
    useQuery({ query: conceptQuery, variables: { conceptName }, onSuccess(data) {
      const requestedConcept = {
        fetchStatus: FetchStatus.full,
        name: conceptName,
        ...data.getConcept
      }
      saveStoreConcept(conceptName, requestedConcept)
      output.value = requestedConcept
    }, onError(/* err */) {
      output.value.fetchStatus = FetchStatus.failure
    },})
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
