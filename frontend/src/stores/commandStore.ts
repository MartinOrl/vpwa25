import { defineStore } from 'pinia'
import type Command from '@/utils/types/command'

export const useCommandStore = defineStore('command', {
  state: () => ({
    activeCommand: null as Command | null,
  }),

  actions: {
    setActiveCommand(command: Command | null) {
      this.activeCommand = command
    },
    getActiveCommand() {
      return this.activeCommand
    },
  },
})
