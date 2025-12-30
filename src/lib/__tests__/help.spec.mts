/**
 * @file Unit Tests - Help
 * @module kronk/lib/tests/unit/Help
 */

import clamp from '#fixtures/commands/clamp'
import copy from '#fixtures/commands/copy'
import distinct from '#fixtures/commands/distinct'
import factorial from '#fixtures/commands/factorial'
import grease from '#fixtures/commands/grease'
import semver from '#fixtures/commands/semver'
import tribonacci from '#fixtures/commands/tribonacci'
import Command from '#lib/command'
import TestSubject from '#lib/help'
import { faker } from '@faker-js/faker'
import { isColorSupported } from '@flex-development/colors'
import type { CommandInfo, CommandName } from '@flex-development/kronk'
import { isObjectPlain } from '@flex-development/tutils'

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
    let command: (root: Command, subcommand: CommandName) => Command

    beforeAll(() => {
      /**
       * Find a `subcommand`.
       *
       * @this {void}
       *
       * @param {Command} root
       *  The root command
       * @param {CommandName} subcommand
       *  The top-level or nested subcommand name or alias
       * @return {Command}
       *  The resulting command
       */
      command = function command(
        this: void,
        root: Command,
        subcommand: CommandName
      ): Command {
        return subcommand ? root.findCommand(subcommand)! : root
      }
    })

    it.each<[info: CommandInfo, subcommand?: CommandName]>([
      [clamp],
      [Object.assign({}, clamp, { name: null })],
      [copy],
      [distinct],
      [factorial],
      [grease],
      [grease, 'bump'],
      [grease, 'recommend'],
      [grease, 'changelog'],
      [grease, 'dist-tag'],
      [grease, 'info'],
      [grease, 'manifest'],
      [grease, 'delete'],
      [grease, 'get'],
      [grease, 'set'],
      [grease, 'pack'],
      [grease, 'publish'],
      [grease, 'tag'],
      [grease, 'create'],
      [grease, 'list'],
      [semver],
      [tribonacci]
    ])('should return help text for `command` (%#)', (info, subcommand) => {
      // Arrange
      const candidate: Command = command(new Command(info), subcommand ?? null)

      // Act
      const result = candidate.help().text(candidate)

      // Expect
      expect(result).to.be.a('string')
      expect(result).toMatchSnapshot()
    })
  })
})
