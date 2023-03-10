import type { UserModule } from '@SRC/types'
import { createClient } from 'villus'
import { LOGIX_URL } from '@SRC/api/LogixAPI'

export const install: UserModule = ({app, isClient}) => {
  if (!isClient) return

  const gqlCLient = createClient({
    url: LOGIX_URL,
  })
  app.use(gqlCLient)
}
