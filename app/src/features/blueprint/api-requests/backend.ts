import { useAxios } from '@vueuse/integrations/useAxios'
import type { Ref } from 'vue'
import type { Concept } from '@FEATURES/blueprint/types'

const BACKEND_URL = 'http://localhost:8080/graphql'

type RequestedConcept = Omit<Concept, 'name'>
export const conceptRequest = (conceptName: string) => {
  const queryName = 'getConcept'
  return {
    getData: (resp: Ref<any>): RequestedConcept => resp.value.data[queryName],
    ...useAxios(BACKEND_URL, {
      method: 'POST',
      data: {
        query: `{
          ${queryName}(name: "${conceptName}") {
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
          }
        }`,
      },
    }),
  }
}
