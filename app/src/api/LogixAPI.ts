import { graphql } from './gql-generated'

export const LOGIX_URL = 'http://localhost:8080/graphql'
export const ConceptQuery = graphql(`
  query concept($conceptName: String!) {
    getConcept(name: $conceptName) {
      arguments {
        name
        capacity
      }
      composition {
        subConcepts {
          id
          concept {
            name
            composition {
              subConcepts {
                concept {
                  name
                }
              }
            }
            wh
          }
          xy
        }
        connections {
          id
          fedSubConceptKey
          fedSubConceptArgumentType {
            name
          }
          fedSubConceptArgumentPositionAngle
          argumentFeederType
          argumentFeederKey
          argumentFeederArgumentType {
            name
          }
        }
      }
      wh
    }
  }
`)
