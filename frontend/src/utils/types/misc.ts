type ValidationRule = (value: string) => boolean | string

enum CommandAllowRule {
  NICKNAME = 'NICKNAME',
  CHANNEL = 'CHANNEL',
}

export { ValidationRule, CommandAllowRule }
