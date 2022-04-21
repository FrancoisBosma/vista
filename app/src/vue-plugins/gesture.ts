import { GesturePlugin } from '@vueuse/gesture'
import type { UserModule } from '@SRC/types'

// https://vueuse-gesture-demo.netlify.app/installation.html
export const install: UserModule = ({ isClient, app }) => {
  if (!isClient) return
  app.use(GesturePlugin)
}
