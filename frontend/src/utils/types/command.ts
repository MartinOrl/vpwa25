type Command = {
  command: string
  shadow: string
  args: string[]
  description: string
  example: string
  validate: (args: string[]) => boolean
  allows: (arg: string) => boolean
}

export default Command
