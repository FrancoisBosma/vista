import type { UserModule } from '@SRC/types'
import { cache, createClient, dedup, fetch } from 'villus'
import unfetch from '@SRC/api/unfetch'
import { LOGIX_URL } from '@SRC/api/LogixAPI'

export const install: UserModule = ({ app, isClient }) => {
  if (!isClient) return

  const fetchPlugin = fetch({
    fetch: unfetch as typeof window.fetch,
  })

  const gqlCLient = createClient({
    url: LOGIX_URL,
    cachePolicy: 'cache-first',
    use: [cache(), dedup(), fetchPlugin],
  })
  app.use(gqlCLient)
}
