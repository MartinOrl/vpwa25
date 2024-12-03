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
          :key="member.username"
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
          <img
            :src="member.avatar"
            :style="{
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: spacing(1),
              minHeight: 'unset !important',
            }"
          />
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
            :key="member.username"
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
            <img
              :src="member.avatar"
              :style="{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: spacing(2),
              }"
            />
            <p
              :style="{
                color: palette.textOnPrimary,
              }"
            >
              {{ member.username }}
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
import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { usersTest } from '@/tmp/dummy'
import { ChannelInfo, ChannelRole } from '@/utils/types/channel'
import { Events } from '@/utils/types/command'
import { UserStatus } from '@/utils/types/user'

const { getChannelById, getActiveChannel } = useChannelStore()
const commandStore = useCommandStore()
const channelStore = useChannelStore()

const membersToolbar = ref(false)
const channelId = ref(0)

const toggleMembersToolbar = () => {
  membersToolbar.value = !membersToolbar.value
}

const openMembersToolbar = () => {
  const activeChannel = getActiveChannel() as ChannelInfo
  channelId.value = activeChannel.id

  membersToolbar.value = true
}

channelStore.$subscribe(() => {
  const activeChannelId = getActiveChannel()?.id as number
  channelId.value = activeChannelId
})

commandStore.$subscribe(() => {
  const eventType = commandStore.event?.type as string
  const eventData = commandStore.event?.data as number
  if (eventType === Events.ListChannelMembers) {
    console.log('ListChannelMembers', eventData)

    if (eventData) {
      channelId.value = Number(eventData)
    } else {
      const activeChannel = getActiveChannel() as ChannelInfo
      channelId.value = activeChannel.id
    }

    toggleMembersToolbar()
    commandStore.clearEvent()
  }
})

type MemberInfo = {
  avatar: string
  username: string
  role: ChannelRole
  status: UserStatus
}

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

  const members = channelMatch.members.filter(
    (m) => m.role !== ChannelRole.KICKED,
  )

  const memberInfo: MemberInfo[] = members.map((member) => {
    const memberMatch = usersTest.find((user) => user.id === member.userId)
    return {
      avatar: memberMatch?.image || '',
      username: memberMatch?.nickName || '',
      role: member.role,
      status: memberMatch?.status || UserStatus.OFFLINE,
    }
  })

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
