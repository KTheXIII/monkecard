import { expect } from 'chai'
import { Command } from '@scripts/command'

describe('Test command management', () => {

  it('should add command to default list', () => {
    const command = new Command<(cmd: string) => boolean>()
    command.addBase('command 1', () => {
      return true
    })
    command.addBase('command 2', () => {
      return true
    })
    expect(command.cmdBaseStrings()).to.deep.equal(['command 1', 'command 2'])
  })

  it('should add command to next list', () => {
    const command = new Command<(cmd: string) => boolean>()
    command.addNext('command 1', (cmd: string) => {
      return true
    })
    expect(command.cmdStrings()).to.deep.equal(['command 1'])
  })

  it('should run next command', async () => {
    const command = new Command<(cmd: string) => boolean>()
    command.addNext('command 1', (cmd: string) => {
      return true
    })
    command.addNext('command 2', (cmd: string) => {
      return false
    })
    expect(await command.run('command 2')).to.equal(false)
    expect(await command.run('command 1')).to.equal(true)
  })

})
