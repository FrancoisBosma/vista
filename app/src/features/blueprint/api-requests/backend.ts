import { useAxios } from '@vueuse/integrations/useAxios'
// import type { Ref } from 'vue'
import type { ConceptComposition, FullConcept, MinimalConcept } from '@FEATURES/blueprint/types'

const BACKEND_URL = 'http://localhost:8080/graphql'
export const REQUEST_TIMEOUT = 1000 * 5

const ApiFetchConcept = <RequestedConcept>(conceptName: string, queryBody: string) => {
  const queryName = 'getConcept'
  const axiosReturn = useAxios(BACKEND_URL, {
    method: 'POST',
    data: {
      query: `{${queryName}(name: "${conceptName}") ${queryBody}}`.replace(/\s+/, ' '),
    },
  })
  return {
    getFetchedConcept: () => axiosReturn.data.value.data[queryName] as RequestedConcept,
    ...axiosReturn,
  }
}

type RequestedFullConcept = Omit<FullConcept, 'name'> | null
// N.B: Some logic is built on top of this function always requesting 'arguments' (cf. stores/Concept.ts)
// => Beware if you want to remove that
export const ApiFetchFullConcept = (conceptName: string) =>
  ApiFetchConcept<RequestedFullConcept>(
    conceptName,
    `{
      arguments {name capacity}
      composition {
        subConcepts {
          concept { name composition { subConcepts { concept {name} } }}
          x
          y
        }
        connections {
          sourceSCIndex
          sourceSCArgumentType {name}
          targetConceptType
          targetConceptIndex
          targetConceptArgumentType {name}
        }
      }
    }`
  )

type RequestedMissingConceptData = {
  arguments: FullConcept['arguments']
  composition: {
    subConcepts: {
      concept: Omit<MinimalConcept, 'name'>
      x: number
      y: number
    }
    connections: ConceptComposition['connections']
  }
}
export const ApiFetchMissingConceptData = (conceptName: string) =>
  ApiFetchConcept<RequestedMissingConceptData>(
    conceptName,
    `{
      arguments {name capacity}
      composition {
        subConcepts {
          concept { composition { subConcepts { concept {name} } }}
          x
          y
        }
        connections {
          sourceSCIndex
          sourceSCArgumentType {name}
          targetConceptType
          targetConceptIndex
          targetConceptArgumentType {name}
        }
      }
    }`
  )
