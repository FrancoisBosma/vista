// N.B: if you update this file name/location, please update accordingly the
// 'gql-codegen' script within package.json

import { LOGIX_URL } from './LogixAPI'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: LOGIX_URL,
  documents: ['src/api/*.ts', '!src/gql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    'src/api/gql-generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
    'src/api/gql-generated/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
