/**
 * @file Unit Tests - Help
 * @module kronk/lib/tests/unit/Help
 */

import bun from '#fixtures/commands/bun'
import clamp from '#fixtures/commands/clamp'
import copy from '#fixtures/commands/copy'
import distinct from '#fixtures/commands/distinct'
import factorial from '#fixtures/commands/factorial'
import grease from '#fixtures/commands/grease'
import tribonacci from '#fixtures/commands/tribonacci'
import Command from '#lib/command'
import TestSubject from '#lib/help'
import { faker } from '@faker-js/faker'
import { isColorSupported } from '@flex-development/colors'
import type { CommandInfo } from '@flex-development/kronk'
import { isObjectPlain } from '@flex-development/tutils'
import { ok } from 'devlop'

describe('unit:lib/Help', () => {
  describe('constructor', () => {
    it('should create custom help text utility', () => {
      // Arrange
      const color: boolean = faker.datatype.boolean()
      const columns: number = faker.number.int({ max: 120, min: 90 })

      // Act
      const result = new TestSubject({ color, columns })

      // Expect
      expect(result).to.have.property('ansi').satisfy(isObjectPlain)
      expect(result).to.have.nested.property('ansi.color', color)
      expect(result).to.have.property('columns', columns)
    })

    it('should create default help text utility', () => {
      // Act
      const result = new TestSubject()

      // Expect
      expect(result).to.have.property('ansi').satisfy(isObjectPlain)
      expect(result).to.have.nested.property('ansi.color', isColorSupported())
      expect(result).to.have.property('columns', 110)
    })
  })

  describe('#text', () => {
    let command: (parent: Command, commands: string[]) => Command
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()

      /**
       * @this {void}
       *
       * @param {Command} parent
       *  The parent command
       * @param {string[]} commands
       *  The list of subcommands
       * @return {Command}
       *  The resulting command
       */
      command = function command(
        this: void,
        parent: Command,
        commands: string[]
      ): Command {
        /**
         * The command.
         *
         * @var {Command} command
         */
        let command: Command = parent

        /**
         * The list of subcommands.
         *
         * @var {Map<string, Command>} subcommands
         */
        let subcommands: Map<string, Command> = command.commands()

        while (commands.length) {
          /**
           * The name or alias of the subcommand.
           *
           * @const {string | undefined} subcommand
           */
          const subcommand: string | undefined = commands.shift()

          ok(subcommand, 'expected subcommand reference')

          command = subcommands.get(subcommand)!
          subcommands = command.commands()
        }

        return command
      }
    })

    it.each<[info: CommandInfo, commands?: string[]]>([
      [bun, ['init']],
      [copy],
      [clamp],
      [Object.assign({}, clamp, { name: null })],
      [distinct],
      [factorial, []],
      [grease],
      [grease, ['bump', 'recommend']],
      [grease, ['changelog']],
      [grease, ['info']],
      [tribonacci]
    ])('should return help text for `command` (%#)', (info, commands) => {
      // Arrange
      const candidate: Command = command(new Command(info), commands ?? [])

      // Act
      const result = subject.text(candidate)

      // Expect
      expect(result).to.be.a('string')
      expect(result).toMatchSnapshot()
    })
  })
})
