import { graphql } from './gql-generated'

export const LOGIX_URL = 'http://localhost:8080/graphql'
export const ConceptQuery = graphql(`
  query concept($conceptName: String!) {
    getConcept(name: $conceptName) {
      arguments {
        name
        capacity
        positionAngle
      }
      composition {
        subConcepts {
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
          fedSubConceptKey
          fedSubConceptArgumentType {
            name
          }
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
