<template>
  <div :style="promptStyle">
    <form @submit.prevent="processSend" :style="toggleStyles">
      <input
        v-model="commandInput"
        ref="commandField"
        :type="'text'"
        :style="inputStyles"
        class="custom-input"
        :disabled="isOffline"
        @input="onInput"
        @mousedown.stop
        @click.stop
        @click="getMenuDisplay"
      />
    </form>
    <q-menu
      v-model="commandListMenuOpen"
      fit
      anchor="bottom left"
      self="bottom left"
      :style="menuStyles"
      class="q-menu-notop"
      persistent
      noFocus
      auto-close
    >
      <q-list>
        <q-item
          v-for="option in commandOptions"
          :key="option.command"
          clickable
          v-ripple
          v-model="selectedOption"
          :label="option.command"
          :value="option.command"
          @click="selectCommand(option)"
        >
          <q-item-section :style="optionStyles">
            <p :style="commandStyle">
              {{ option.command }}
            </p>
            <div>
              <p>
                {{ option.shadow }}
              </p>
              <p>
                {{ option.description }}
              </p>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-menu
      v-model="suggestionsOpen"
      fit
      anchor="bottom left"
      self="bottom left"
      :style="menuStyles"
      class="q-menu-notop"
      persistent
      noFocus
      auto-close
    >
      <q-list>
        <q-item
          v-for="option in suggestions"
          :key="option.name"
          clickable
          v-ripple
          v-model="selectedOption"
          :label="option.name"
          :value="option.name"
          @click="handleClickSuggestion(option)"
        >
          <q-item-section :style="optionStyles">
            <q-icon
              :name="
                'privacy' in option
                  ? option.privacy === ChannelPrivacy.PRIVATE
                    ? 'lock'
                    : 'tag'
                  : 'person'
              "
              :style="{
                color: palette.textOpaque,
              }"
            />
            <p :style="commandStyle">{{ option.name }}</p>
          </q-item-section>
        </q-item>
      </q-list>
      <div
        v-if="!suggestions?.length"
        :style="{
          padding: spacing(3),
          color: palette.textOpaque,
        }"
      >
        No suggestions
      </div>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties, VNodeRef } from 'vue'
import { api } from '@/boot/axios'
import { palette, spacing } from '@/css/theme'
import { sanitizeStatus, useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { useUsersStore } from '@/stores/usersStore'
import { getCommands } from '@/utils/commands'
import { ChannelPrivacy, ChannelRole } from '@/utils/types/channel'
import { Events, MatchUsersList, type Command } from '@/utils/types/command'
import { CommandAllowRule } from '@/utils/types/misc'
import { User, UserStatus } from '@/utils/types/user'

type Suggestion = {
  name: string
}

const commandStore = useCommandStore()
const { setActiveCommand, callEvent } = commandStore
const { getChannels, processSendMessage, getActiveChannel } = useChannelStore()
const { user } = useAuthStore()
const { findUserById } = useUsersStore()

const commandInput = ref('')
const commandField = ref<VNodeRef | null>(null)
const commandListMenuOpen = ref(false)
const suggestionsOpen = ref(false)
const isOffline = ref(user?.status === UserStatus.OFFLINE)

const authStore = useAuthStore()

authStore.$subscribe(() => {
  isOffline.value =
    sanitizeStatus(authStore.user?.status as UserStatus) ===
    sanitizeStatus(UserStatus.OFFLINE)
})

const openCommandsMenu = async () => {
  commandListMenuOpen.value = true
  await nextTick()
  commandField.value.focus()
}

watch(commandListMenuOpen, (value) => {
  if (value) {
    const _inputParts = commandInput.value.split(' ')
    const command = _inputParts[0]
    if (!command.startsWith('/')) {
      commandListMenuOpen.value = false
    }
  }
})

const closeCommandsMenu = () => {
  commandListMenuOpen.value = false
}

const openSuggestionsMenu = async () => {
  suggestionsOpen.value = true
  await nextTick()
  commandField.value.focus()
}

const closeSuggestionsMenu = () => {
  suggestionsOpen.value = false
}

const commandOptions = computed(() => {
  const commandValue = commandInput.value.split(' ')[0]
  return getCommands().filter((option) => {
    return option.command.toLowerCase().includes(commandValue.toLowerCase())
  })
})

const selectedOption = ref('option1')
const matchedCommand = ref<Command | null>(null)

const suggestions = computed(() => {
  console.log('Suggestions', commandInput.value)
  const _inputParts = commandInput.value.split(' ')
  const kwargs = _inputParts.slice(1)
  console.log('kwargs', _inputParts)

  const suggestionRequest = kwargs[0] || ''

  if (suggestionRequest.startsWith('#')) {
    const channelName = suggestionRequest.slice(1)
    const filtered = getChannels()?.filter((channel) =>
      channel.name.toLowerCase().includes(channelName.toLowerCase()),
    )
    return filtered?.map((channel) => ({
      name: channel.name,
    }))
  }

  if (suggestionRequest.startsWith('@')) {
    const nickName = suggestionRequest.slice(1)

    const members = getActiveChannel()?.members || []

    let usersData: {
      id: number
      nickName: string
    }[] = []

    members.forEach((member) => {
      const user = findUserById(member.userId) as User
      usersData.push({
        id: user.id,
        nickName: user.nickName,
      })
    })

    console.log('Users sug', usersData)

    const memberIDRole = members.map((matchedCommand) => ({
      id: matchedCommand.userId,
      role: matchedCommand.role,
    }))

    if (matchedCommand.value?.usersMatch) {
      if (matchedCommand.value.usersMatch === MatchUsersList.MEMBERS) {
        usersData = usersData.filter(
          (member) =>
            member.nickName.toLowerCase().startsWith(nickName.toLowerCase()) &&
            member.id !== user?.id &&
            memberIDRole.find((m) => m.id === member.id) &&
            memberIDRole.find((m) => m.id === member.id)?.role !==
              ChannelRole.KICKED,
        )
      } else if (matchedCommand.value.usersMatch === MatchUsersList.OTHERS) {
        console.log('Other users', usersData, memberIDRole)
        usersData = usersData.filter(
          (member) =>
            member.nickName.toLowerCase().startsWith(nickName.toLowerCase()) &&
            member.id !== user?.id &&
            !memberIDRole.find((m) => m.id === member.id),
        )
      }
    } else {
      usersData = usersData.filter(
        (member) =>
          member.nickName.toLowerCase().startsWith(nickName.toLowerCase()) &&
          member.id !== user?.id &&
          memberIDRole.find((m) => m.id === member.id),
      )
    }

    return usersData.map((user) => ({
      name: user.nickName,
    }))
  }

  return null
})

const getMenuDisplay = () => {
  const inputParts = commandInput.value.split(' ')
  const command = inputParts[0]
  const kwargs = inputParts.slice(1)

  matchedCommand.value =
    getCommands().find((option) => option.command === command) || null

  if (matchedCommand.value && kwargs.length) {
    closeCommandsMenu()
    const arg1 = kwargs[0]

    if (
      arg1 &&
      arg1.startsWith('#') &&
      matchedCommand.value?.allows(CommandAllowRule.CHANNEL)
    ) {
      openSuggestionsMenu()
    } else if (
      arg1 &&
      arg1.startsWith('@') &&
      matchedCommand.value?.allows(CommandAllowRule.NICKNAME)
    ) {
      openSuggestionsMenu()
    } else {
      closeSuggestionsMenu()
    }
  } else {
    closeSuggestionsMenu()
    if (command.startsWith('/')) {
      openCommandsMenu()
    } else {
      closeCommandsMenu()
    }

    const lastKwarg = kwargs[kwargs.length - 1]
    if (lastKwarg && lastKwarg.startsWith('@')) {
      openSuggestionsMenu()
    }

    setActiveCommand(null)
  }
}

commandStore.$subscribe(() => {
  const eventType = commandStore.event?.type as string

  if (eventType === Events.RequestSendMessage && commandInput.value) {
    processSend()
  } else if (eventType === Events.SendMessage && commandInput.value) {
    const message = `${commandInput.value}`
    processSendMessage(message)
    clearInput()
  }
})

const processSend = async () => {
  if (commandInput.value === '') return
  const _inputParts = commandInput.value.split(' ')
  const command = _inputParts[0]
  api.post(`/channel/typing/${getActiveChannel()?.id}`, {
    message: '',
    name: '',
  })
  if (command.startsWith('/')) {
    processCommand()
  } else {
    callEvent<string>({
      type: Events.SendMessage,
      data: commandInput.value,
    })
  }
}

const processCommand = () => {
  const _inputParts = commandInput.value.split(' ')
  const kwargs = _inputParts.slice(1)

  const suggestion1 = kwargs[0]

  if (suggestion1) {
    if (suggestion1.startsWith('#')) {
      const channel = getChannels()?.find(
        (channel) => channel.name === suggestion1.slice(1),
      )
      if (channel) {
        kwargs[0] = String(channel.id)
      } else return
    }
  }

  const commandValidated = matchedCommand.value?.validate(kwargs)

  clearInput()
  if (!commandValidated) return

  callEvent({
    type: Events.TypingStop,
  })
  matchedCommand.value?.run(kwargs)
}

const clearInput = async () => {
  commandInput.value = ''
  callEvent({
    type: Events.TypingStop,
  })
  await nextTick()
  getMenuDisplay()
}

const selectCommand = (command: Command) => {
  setActiveCommand(command)
  commandInput.value = command.command + ' '
  getMenuDisplay()
}

const promptStyle = computed<CSSProperties>(() => ({
  background: palette.background,
  padding: '0',
  borderRadius: spacing(2),
  alignItems: 'start',
  position: 'relative',
  overflow: 'hidden',
  transition: 'none !important',
  border: `1px solid ${palette.border}`,
  color: palette.textOpaque,
  flexGrow: 1,
  zIndex: 2,
  width: window.innerWidth < 768 ? '100%' : 'calc(100% - 300px)',
}))

const onInput = (event: Event) => {
  event.preventDefault()

  const target = event.target as HTMLInputElement
  commandInput.value = target.value
  getMenuDisplay()
  callEvent<{
    message: string
    name: string
  }>({
    type: Events.Typing,
    data: {
      message: commandInput.value,
      name: user?.nickName as string,
    },
  })

  api.post(`/channel/typing/${getActiveChannel()?.id}`, {
    message: commandInput.value,
    name: user?.nickName,
  })
}

const menuStyles = computed<CSSProperties>(() => ({
  background: palette.background,
  border: `1px solid ${palette.border}`,
  borderRadius: spacing(2),
  color: palette.textOpaque,
  bottom: '72px !important',
}))

const commandStyle = computed<CSSProperties>(() => ({
  color: palette.textOnPrimary,
  maxWidth: '64px',
  width: '100%',
}))

const optionStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: spacing(4),
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))

const toggleStyles = computed<CSSProperties>(() => ({
  color: palette.textOpaque,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
}))

const inputStyles = computed<CSSProperties>(() => ({
  backgroundColor: palette.background,
  color: palette.textOnPrimary,
  padding: `${spacing(2)} ${spacing(3)} ${spacing(3)} ${spacing(5)}`,
  outline: 'none',
  border: 'none',
  width: '100%',
  fontSize: '1rem',
}))

const handleClickSuggestion = (suggestion: Suggestion) => {
  // commandInput.value = commandInput.value.split(' ')[0] + ' #' + channel.name
  if ('privacy' in suggestion) {
    commandInput.value =
      commandInput.value.split(' ')[0] + ' #' + suggestion.name
  } else {
    commandInput.value =
      commandInput.value.split(' ')[0] + ' @' + suggestion.name
  }
  closeSuggestionsMenu()
}

const handleClickOutside = (event: Event) => {
  if (
    !commandField.value.contains(event.target) &&
    !(event.target as Element)?.closest('.q-menu')
  ) {
    commandListMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
