import { Transmit } from '@adonisjs/transmit-client'
import { boot } from 'quasar/wrappers'

declare module 'vue' {
  interface ComponentCustomProperties {
    $backendTransmit: Transmit
  }
}

const backendTransmit = new Transmit({
  baseUrl: 'http://192.168.210.164:3001',
})

export default boot(({ app }) => {
  app.config.globalProperties.$transmit = backendTransmit
})

export { backendTransmit }
