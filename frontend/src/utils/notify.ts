import { useAuthStore } from '@/stores/authStore'
import { UserStatus } from './types/user'

const notify = (message: string, from: string) => {
  const perm = Notification.permission
  const { notificationsType, user } = useAuthStore()
  if (perm === 'denied') return
  if (notificationsType === 'mention') {
    if (!message.includes('@')) return
  }
  if (user?.status === UserStatus.DO_NOT_DISTURB) return
  const _n = new Notification(`${from} sent you a message`, {
    body: message.slice(0, 56) + '...',
    icon: '/favicon.png',
  })
}

export { notify }
