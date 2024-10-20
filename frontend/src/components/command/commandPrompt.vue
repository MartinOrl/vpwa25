<template>
  <div dense :style="promptStyle" noCaps flat>
    <div :style="toggleStyles">
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

      <q-icon name="search" size="1.25rem" :style="iconStyle" />
    </div>
    <q-menu
      v-model="commandListMenuOpen"
      fit
      anchor="bottom left"
      :offset="[0, 10]"
      :style="menuStyles"
      persistent
      noFocus
    >
      <q-list>
        <q-item
          v-for="option in options"
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
      :offset="[0, 10]"
      :style="menuStyles"
      persistent
      noFocus
    >
      <q-list>
        <q-item
          v-for="option in suggestedChannels"
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
              :name="option.privacy === ChannelPrivacy.PRIVATE ? 'lock' : 'tag'"
              :style="{
                color: palette.textOpaque,
              }"
            />
            <p :style="commandStyle">{{ option.name }}</p>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties, VNodeRef } from 'vue'
import { palette, containers, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { getCommands } from '@/utils/commands'
import { ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'
import Command from '@/utils/types/command'

const { setActiveCommand } = useCommandStore()
const { getChannels } = useChannelStore()

const commandInput = ref('')
const commandField = ref<VNodeRef | null>(null)
const commandListMenuOpen = ref(false)
const suggestionsOpen = ref(false)

const openCommandsMenu = async () => {
  commandListMenuOpen.value = true
  await nextTick()
  commandField.value.focus()
}

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

const options = computed(() => {
  return getCommands().filter((option) => {
    return option.command
      .toLowerCase()
      .includes(commandInput.value.toLowerCase())
  })
})

const selectedOption = ref('option1')

const suggestedChannels = computed(() => {
  const channelInput = commandInput.value.split(' ')[1]

  if (!channelInput.startsWith('#')) return []

  const channelName = channelInput.slice(1)
  return getChannels()?.filter((channel) =>
    channel.name.toLowerCase().includes(channelName.toLowerCase()),
  )
})

const getMenuDisplay = () => {
  const inputParts = commandInput.value.split(' ')
  const command = inputParts[0]
  const kwargs = inputParts.slice(1)

  const matchedCommand = getCommands().find(
    (option) => option.command === command,
  )
  if (matchedCommand) {
    closeCommandsMenu()
    const arg1 = kwargs[0]
    if (arg1 && arg1.startsWith('#') && matchedCommand?.allows('channel')) {
      openSuggestionsMenu()
    } else {
      closeSuggestionsMenu()
    }
  } else {
    closeSuggestionsMenu()
    openCommandsMenu()
    setActiveCommand(null)
  }
}

const selectCommand = (command: Command) => {
  setActiveCommand(command)
  commandInput.value = command.command + ' '
  getMenuDisplay()
}

const promptStyle = computed<CSSProperties>(() => ({
  background: palette.background,
  maxWidth: containers.search,
  width: '100%',
  padding: '0',
  borderRadius: spacing(2),
  marginLeft: spacing(6),
  cursor: 'pointer',
  alignItems: 'start',
  position: 'relative',
  overflow: 'hidden',
  transition: 'none !important',
}))

const onInput = (event: Event) => {
  event.preventDefault()

  const target = event.target as HTMLInputElement
  commandInput.value = target.value
  getMenuDisplay()
}

const menuStyles = computed<CSSProperties>(() => ({
  background: palette.background,
  border: `1px solid ${palette.border}`,
  borderRadius: spacing(2),
  color: palette.textOpaque,
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

const iconStyle = computed<CSSProperties>(() => ({
  color: palette.textOpaque,
  padding: `${spacing(2)} ${spacing(3)}`,
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
  padding: `${spacing(2)} ${spacing(3)} ${spacing(2)} ${spacing(5)}`,
  outline: 'none',
  border: 'none',
  width: '80%',
}))

const handleClickSuggestion = (channel: ChannelInfo) => {
  commandInput.value = commandInput.value.split(' ')[0] + ' #' + channel.name
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
