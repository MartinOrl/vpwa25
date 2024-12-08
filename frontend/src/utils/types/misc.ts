type ValidationRule = (value: string) => boolean | string

enum CommandAllowRule {
  NICKNAME = 'NICKNAME',
  CHANNEL = 'CHANNEL',
}

type ServerEvent = {
  event: string
  data: unknown
}

type ServerEventHandler = {
  signature: string
  handler: (event: ServerEvent) => unknown
}

export { ValidationRule, CommandAllowRule, ServerEvent, ServerEventHandler }
