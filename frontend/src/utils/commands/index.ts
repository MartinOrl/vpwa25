import type { Command } from '../types/command'
import cancelChannelSubCommand from './cancel'
import inviteToChannelCommand from './invite'
import joinChannelCommand from './join'
import kickUserCommand from './kick'
import listChannelsCommand from './list'
import quitChannelCommand from './quit'
import revokeFromChannelCommand from './revoke'

const _commands: Command[] = [
  joinChannelCommand,
  inviteToChannelCommand,
  revokeFromChannelCommand,
  kickUserCommand,
  cancelChannelSubCommand,
  quitChannelCommand,
  listChannelsCommand,
]

const getCommands = () => {
  return _commands
}

export { getCommands }
