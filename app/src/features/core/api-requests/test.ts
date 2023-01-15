import { useAxios } from '@vueuse/integrations/useAxios'

export const testRequest = () =>
  useAxios('http://localhost:8080/graphql', {
    method: 'POST',
    data: {
      query: `{
        getConcept(name: "Communication") {
          arguments {name capacity}
          composition {
            subConcepts {name}
            connections {
              sourceSCIndex
              sourceSCArgumentType {name}
              targetConceptType
              targetConceptIndex
              targetConceptArgumentIndex
            }
            coordinates {
              sourceSCIndex
              x
              y
            }
          }
        }
      }`,
    },
  })
