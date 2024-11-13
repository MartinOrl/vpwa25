<template>
  <div :style="promptStyle">
    <form @submit.prevent="processSend" :style="toggleStyles">
      <input
        v-model="commandInput"
        ref="commandField"
        :type="'text'"
        :style="inputStyles"
        class="custom-input"
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
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { usersTest } from '@/tmp/dummy'
import { getCommands } from '@/utils/commands'
import { ChannelPrivacy, ChannelData, ChannelRole } from '@/utils/types/channel'
import { Events, MatchUsersList, type Command } from '@/utils/types/command'
import { CommandAllowRule } from '@/utils/types/misc'
import { User } from '@/utils/types/user'
import { sendSocketMessage } from '@/utils/socket'

const commandStore = useCommandStore()
const { setActiveCommand, callEvent } = commandStore
const {
  getChannels,
  processSendMessage,
  getActiveChannel,
  updateChannelMetadata,
  getChannelMetadata,
} = useChannelStore()
const { user } = useAuthStore()

const commandInput = ref('')
const commandField = ref<VNodeRef | null>(null)
const commandListMenuOpen = ref(false)
const suggestionsOpen = ref(false)

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
  const _inputParts = commandInput.value.split(' ')
  const kwargs = _inputParts.slice(1)

  const suggestionRequest = kwargs[0] || ''

  if (suggestionRequest.startsWith('#')) {
    const channelName = suggestionRequest.slice(1)
    return getChannels()?.filter((channel) =>
      channel.name.toLowerCase().includes(channelName.toLowerCase()),
    )
  }

  if (suggestionRequest.startsWith('@')) {
    const nickName = suggestionRequest.slice(1)

    const usersData = [...usersTest]
    const memberIDRole =
      getActiveChannel()?.members.map((member) => ({
        id: member.userId,
        role: member.role,
      })) || []

    if (matchedCommand.value?.usersMatch) {
      if (matchedCommand.value.usersMatch === MatchUsersList.MEMBERS) {
        return usersData.filter(
          (member) =>
            member.nickName.toLowerCase().startsWith(nickName.toLowerCase()) &&
            member.id !== user?.id &&
            memberIDRole.find((m) => m.id === member.id) &&
            memberIDRole.find((m) => m.id === member.id)?.role !==
              ChannelRole.KICKED,
        )
      } else if (matchedCommand.value.usersMatch === MatchUsersList.OTHERS) {
        return usersData.filter(
          (member) =>
            member.nickName.toLowerCase().startsWith(nickName.toLowerCase()) &&
            member.id !== user?.id &&
            (!memberIDRole.find((m) => m.id === member.id) ||
              memberIDRole.find((m) => m.id === member.id)?.role ===
                ChannelRole.KICKED),
        )
      }
    } else {
      return usersData.filter(
        (member) =>
          member.nickName.toLowerCase().startsWith(nickName.toLowerCase()) &&
          member.id !== user?.id &&
          memberIDRole.find((m) => m.id === member.id),
      )
    }

    return usersData
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
  if (eventType === Events.RequestSendMessage) {
    processSend()
  } else if (eventType === Events.SendMessage) {
    const message = commandInput.value
    processSendMessage(message)
    clearInput()
  }
})

const processSend = () => {
  if (commandInput.value === '') return
  const _inputParts = commandInput.value.split(' ')
  const command = _inputParts[0]
  if (command.startsWith('/')) {
    processCommand()
  } else {
    callEvent<string>({
      type: Events.SendMessage,
      data: commandInput.value,
    })
    sendSocketMessage(commandInput.value)
    const activeChannel = getActiveChannel()
    const channelMetadata = getChannelMetadata(activeChannel?.id as number)
    if (channelMetadata) {
      updateChannelMetadata(activeChannel?.id as number, {
        ...channelMetadata,
        notifications: [
          ...channelMetadata.notifications,
          {
            id: channelMetadata.notifications.length + 1,
            message: commandInput.value,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    } else {
      updateChannelMetadata(activeChannel?.id as number, {
        channelId: activeChannel?.id as number,
        isInvitation: false,
        notifications: [
          {
            id: 1,
            message: commandInput.value,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }
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

const handleClickSuggestion = (suggestion: User | ChannelData) => {
  // commandInput.value = commandInput.value.split(' ')[0] + ' #' + channel.name
  if ('privacy' in suggestion) {
    commandInput.value =
      commandInput.value.split(' ')[0] + ' #' + suggestion.name
  } else {
    commandInput.value =
      commandInput.value.split(' ')[0] + ' @' + suggestion.nickName
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
