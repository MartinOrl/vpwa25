<template>
  <div
    :style="{
      position: 'relative',
    }"
  >
    <img
      :src="profileImage"
      :style="{
        width: `${_props.size}px`,
        height: `${_props.size}px`,
        cursor: 'pointer',
        display: 'block',
        borderRadius: '8px',
      }"
    />
    <div :style="statusStyles" v-if="_props.showUserStatus">
      <span :style="statusDotStyles"> </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type CSSProperties } from 'vue'
import { palette } from '@/css/theme'
import { User, UserStatus } from '@/utils/types/user'

const _props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
  size: {
    type: Number,
    default: 36,
  },
  showUserStatus: {
    type: Boolean,
    default: false,
  },
})

const generateAvatarLink = (firstName: string, lastName: string) => {
  return `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=64`
}

const profileImage = computed(() => {
  return (
    _props.user.profilePicture ||
    generateAvatarLink(_props.user.firstName, _props.user.lastName)
  )
})

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

const statusDotStyles = computed<CSSProperties>(() => {
  const status = _props.user.status
  console.log(status)
  return {
    background:
      status === UserStatus.ONLINE
        ? palette.status.ONLINE
        : status === UserStatus.DO_NOT_DISTURB
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
  }
})
</script>
