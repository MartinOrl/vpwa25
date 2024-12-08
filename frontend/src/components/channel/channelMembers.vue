<template>
  <q-btn
    flat
    dense
    :style="{
      display: 'flex',
      flexDirection: 'row',
      gap: spacing(2),
      alignItems: 'center',
      marginLeft: 'auto',
      padding: `
            ${spacing(1)}
            ${spacing(1)}
            ${spacing(1)}
            ${spacing(3)}
          `,
      borderRadius: spacing(2),
      border: '1px solid',
      borderColor: palette.border,
    }"
    @click="openMembersToolbar"
  >
    <div
      :style="{
        display: 'flex',
        gap: spacing(2),
        alignItems: 'center',
      }"
    >
      <q-list
        :style="{
          display: 'flex',
        }"
      >
        <q-item
          v-for="member in channelMembersInfo.slice(0, 3)"
          :key="member.nickName"
          :style="{
            display: 'flex',
            alignItems: 'center',
            padding: spacing(0.5),
            borderRadius: spacing(2),
            overflow: 'hidden',
            backgroundColor: palette.background,
            marginLeft: `-${spacing(2)}`,
            maxWidth: spacing(8),
            maxHeight: spacing(8),
            height: `${spacing(8)} !important`,
            minHeight: 'unset !important',
            zIndex: 100 - channelMembersInfo.indexOf(member),
          }"
        >
          <UserProfileImage :user="member" />
        </q-item>
      </q-list>
      <p
        :style="{
          color: palette.textOnPrimary,
          fontSize: '1rem',
          padding: `0 ${spacing(2)} 0 ${spacing(1)}`,
          textAlign: 'center',
        }"
      >
        {{ channelMembersInfo.length }}
      </p>
    </div>
  </q-btn>
  <q-dialog v-model="membersToolbar">
    <q-card :style="dialogStyles">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Members</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item
            v-for="member in channelMembersInfo"
            :key="member.nickName"
            clickable
            :style="{
              display: 'flex',
              alignItems: 'center',
              padding: spacing(1),
              borderRadius: spacing(2),
              overflow: 'hidden',
              gap: spacing(2),
              backgroundColor: palette.background,
              marginBottom: spacing(1),
            }"
          >
            <UserProfileImage :user="member" />
            <p
              :style="{
                color: palette.textOnPrimary,
              }"
            >
              {{ member.nickName }}
            </p>
            <div :style="statusDotStyles">
              <span
                :style="{
                  ...getStatusStyles(member.status),
                }"
              >
              </span>
            </div>

            <p
              :style="{
                fontSize: '0.875rem',
                color: palette.textOpaque,
                marginLeft: 'auto',
                fontWeight: 'bold',
              }"
              v-show="member.role === ChannelRole.ADMIN"
            >
              Admin
            </p>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { palette, spacing } from '@/css/theme'
import { sanitizeStatus } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { useUsersStore } from '@/stores/usersStore'
import { ChannelInfo, ChannelRole } from '@/utils/types/channel'
import { Events } from '@/utils/types/command'
import { User, UserStatus } from '@/utils/types/user'
import UserProfileImage from '../user/userProfileImage.vue'

const { getChannelById, getActiveChannel, findChannelByName } =
  useChannelStore()
const commandStore = useCommandStore()
const channelStore = useChannelStore()
const { findUserById } = useUsersStore()

const membersToolbar = ref(false)
const channelId = ref(0)

const toggleMembersToolbar = () => {
  if (!membersToolbar.value) {
    document.body.style.overflow = 'hidden '
  } else {
    document.body.style.overflow = 'auto'
  }

  membersToolbar.value = !membersToolbar.value
}

const openMembersToolbar = async () => {
  const activeChannel = getActiveChannel() as ChannelInfo
  channelId.value = activeChannel.id

  document.body.style.overflow = 'hidden'

  await channelStore.reloadMembers(activeChannel.name)

  membersToolbar.value = true
}

channelStore.$subscribe(() => {
  const activeChannelId = getActiveChannel()?.id as number
  channelId.value = activeChannelId
})

commandStore.$subscribe(() => {
  const eventType = commandStore.event?.type as string
  const eventData = commandStore.event?.data as string
  if (eventType === Events.ListChannelMembers) {
    if (eventData) {
      channelId.value = findChannelByName(eventData)?.id as number
    } else {
      const activeChannel = getActiveChannel() as ChannelInfo
      channelId.value = activeChannel.id
    }

    toggleMembersToolbar()
    commandStore.clearEvent()
  }
})

const dialogStyles = computed(() => ({
  background: palette.background,
  color: palette.textOnPrimary,
  minWidth: '350px',
}))

const channelMembersInfo = computed(() => {
  console.log('channelId', channelId.value)
  const channelMatch = getChannelById(channelId.value) as ChannelInfo
  console.log('channelMatch', channelMatch)
  if (!channelMatch) {
    return []
  }

  const members = channelMatch.members

  const users: User[] = []

  members.forEach((member) => {
    const user = findUserById(member.userId)
    if (user) {
      users.push({
        ...user,
        status: sanitizeStatus(user.status) as UserStatus,
      })
    }
  })

  const matchUserWithMember = (userId: number) => {
    return members.find((member) => member.userId === userId)
  }

  const memberInfo = users.map((user) => {
    return {
      ...user,
      role: matchUserWithMember(user.id)?.role || ChannelRole.MEMBER,
    }
  })

  console.log('memberInfo', memberInfo)

  return memberInfo
})

const statusDotStyles = computed<CSSProperties>(() => ({
  background: palette.background,
  width: '0.625rem',
  height: '0.625rem',
  display: 'inline-block',
  borderRadius: '50%',

  position: 'relative',
  padding: '0.125rem',
  zIndex: 1,
}))

const getStatusStyles: (status: UserStatus) => CSSProperties = (
  status: UserStatus,
) => {
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
}

onBeforeMount(() => {
  const activeChannel = getActiveChannel() as ChannelInfo
  channelId.value = activeChannel.id
})
</script>
