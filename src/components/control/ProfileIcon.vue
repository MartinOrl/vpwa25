<template>
  <div
    :style="{
      position: 'relative',
      margin: '0 auto',
      width: '2.75rem',
    }"
  >
    <img
      :src="user?.image"
      :alt="user?.name"
      :style="{
        width: '2.75rem',
        height: '2.75rem',
        cursor: 'pointer',
        display: 'block',
        borderRadius: spacing(2),
      }"
    />
    <div :style="statusStyles">
      <span :style="statusDotStyles"> </span>
    </div>
    <UserOptionsPopup />
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import type { CSSProperties } from 'vue'
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { UserStatus } from '@/utils/types/user'
import UserOptionsPopup from '../popup/UserOptionsPopup.vue'

const { user } = useAuthStore()

defineComponent({
  setup() {
    return {
      user: user,
      spacing,
    }
  },
})

console.log(user)

const statusStyles = computed<CSSProperties>(() => ({
  background: palette.background,
  width: '0.625rem',
  height: '0.625rem',
  display: 'inline-block',
  borderRadius: '50%',
  position: 'absolute',
  bottom: '-0.125rem',
  right: '-0.125rem',
  padding: '0.125rem',
  zIndex: 1,
}))

const statusDotStyles = computed<CSSProperties>(() => ({
  background:
    user?.status === UserStatus.ONLINE
      ? palette.status.ONLINE
      : user?.status === UserStatus.DO_NOT_DISTURB
      ? palette.status.DO_NOT_DISTURB
      : palette.status.OFFLINE,
  width: '70%',
  height: '70%',
  display: 'inline-block',
  borderRadius: '50%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}))
</script>
