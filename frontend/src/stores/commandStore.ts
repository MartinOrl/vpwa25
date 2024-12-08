import { defineStore } from 'pinia'
import type { Command, Event } from '@/utils/types/command'

export const useCommandStore = defineStore('command', {
  state: () => ({
    activeCommand: null as Command | null,
    event: null as Event<unknown> | null,
    test: 'test',
  }),

  actions: {
    setActiveCommand(command: Command | null) {
      this.activeCommand = command
    },
    getActiveCommand() {
      return this.activeCommand
    },
    callEvent<T>(event: Event<T>): void {
      console.log('callEvent', event)
      this.event = event
    },
    clearEvent() {
      this.event = null
    },
  },
})
