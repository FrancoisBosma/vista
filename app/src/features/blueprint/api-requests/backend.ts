import { useAxios } from '@vueuse/integrations/useAxios'
import { FetchStatus } from '@FEATURES/blueprint/types'
import type { FullConcept } from '@FEATURES/blueprint/types'

const BACKEND_URL = 'http://localhost:8080/graphql'
export const REQUEST_TIMEOUT = 1000 * 5

const ApiFetchConcept = <RequestedConcept>(conceptName: string, queryBody: string) => {
  const queryName = 'getConcept'
  const axiosReturn = useAxios(BACKEND_URL, {
    method: 'POST',
    data: {
      query: `{${queryName}(name: "${conceptName}") ${queryBody}}`.replace(/\s+/, ' '),
    },
    timeout: REQUEST_TIMEOUT,
  })
  return {
    ...axiosReturn,
    getFetchedConcept: () => {
      if (!axiosReturn.data.value.data?.[queryName]) return null
      return {
        fetchStatus: FetchStatus.full,
        name: conceptName,
        ...axiosReturn.data.value.data[queryName],
      } as RequestedConcept
    },
  }
}
// N.B: Some logic is built on top of this function always requesting 'arguments' (cf. stores/Concept.ts)
// => Beware if you want to remove that
export const ApiFetchFullConcept = (conceptName: string) =>
  ApiFetchConcept<FullConcept | null>(
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
