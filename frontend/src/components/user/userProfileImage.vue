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
import { computed, ref } from 'vue'
import { type CSSProperties } from 'vue'
import { palette } from '@/css/theme'
import { sanitizeStatus } from '@/stores/authStore'
import { useUsersStore } from '@/stores/usersStore'
import { User, UserStatus } from '@/utils/types/user'

const usersStore = useUsersStore()

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

const _userRef = computed(() => _props.user)

const generateAvatarLink = (firstName: string, lastName: string) => {
  return `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=64`
}

const profileImage = ref<string>(
  _userRef.value?.profilePicture ||
    generateAvatarLink(_userRef.value.firstName, _userRef.value.lastName),
)

const _status = ref(_userRef.value.status)

usersStore.$subscribe(() => {
  const userMatch = usersStore.findUserById(_userRef.value.id)
  _status.value = sanitizeStatus(userMatch?.status as string) as UserStatus
  profileImage.value =
    userMatch?.profilePicture ||
    generateAvatarLink(
      userMatch?.firstName as string,
      userMatch?.lastName as string,
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
  return {
    background:
      _status.value === UserStatus.ONLINE
        ? palette.status.ONLINE
        : _status.value === UserStatus.DO_NOT_DISTURB
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
