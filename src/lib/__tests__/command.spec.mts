/**
 * @file Unit Tests - Command
 * @module kronk/lib/tests/unit/Command
 */

import chars from '#enums/chars'
import eid from '#enums/keid'
import CommandError from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import average from '#fixtures/commands/average'
import tribonacci from '#fixtures/commands/tribonacci'
import date from '#fixtures/date'
import kCommand from '#internal/k-command'
import noop from '#internal/noop'
import Argument from '#lib/argument'
import TestSubject from '#lib/command'
import Helpable from '#lib/helpable.abstract'
import Option from '#lib/option'
import VersionOption from '#lib/version.option'
import errorSnapshot from '#tests/utils/error-snapshot'
import sfmt from '#tests/utils/sfmt'
import isOption from '#utils/is-option'
import type {
  Action,
  CommandInfo,
  CommandName,
  Exit,
  HelpCommandData,
  HelpOptionData,
  OptionPriority,
  UsageData,
  VersionData
} from '@flex-development/kronk'
import pkg from '@flex-development/kronk/package.json' with { type: 'json' }
import type { MockInstance } from 'vitest'

describe('unit:lib/Command', () => {
  describe('constructor', () => {
    it('should be help text candidate', () => {
      expect(new TestSubject()).to.be.instanceof(Helpable)
    })
  })

  describe('.isCommand', () => {
    it.each<Parameters<typeof TestSubject['isCommand']>>([
      [chars.digit3],
      [date],
      [new Argument('[]')],
      [new Option('--command')],
      [null]
    ])('should return `false` if `value` is not `Command`-like (%#)', value => {
      expect(TestSubject.isCommand(value)).to.be.false
    })

    it.each<Parameters<typeof TestSubject['isCommand']>>([
      [{ [kCommand]: true }],
      [new TestSubject()]
    ])('should return `true` if `value` looks like `Command` (%#)', value => {
      expect(TestSubject.isCommand(value)).to.be.true
    })
  })

  describe('#action', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it('should return command action callback', () => {
      expect(subject.action()).to.eq(noop)
    })

    it('should set command action callback and return `this`', () => {
      // Arrange
      const action: Action = vi.fn().mockName('action')

      // Act
      const result = subject.action(action)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.action', action)
    })
  })

  describe('#addArgument', () => {
    it('should throw if argument is added after variadic argument', () => {
      // Arrange
      const subject: TestSubject = new TestSubject(average)
      let error!: KronkError

      // Act
      try {
        subject.addArgument(new Argument(sfmt.required({ variadic: true })))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('stack').match(/addArgument/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })
  })

  describe('#addCommand', () => {
    let alias: string
    let cmd: string
    let subject: TestSubject

    beforeAll(() => {
      alias = 'tz'
      cmd = 'timezone'

      subject = new TestSubject({ aliases: alias, name: cmd })

      // @ts-expect-error testing (2445).
      subject.info.subcommands = [
        new TestSubject({ aliases: 'tz', name: 'timezone' })
      ]
    })

    it('should throw on `command` alias conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject('timezones', { aliases: alias }))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it('should throw on `command` name conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject(cmd))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it('should throw on invalid `command` name', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject())
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })
  })

  describe('#addOption', () => {
    let option: Option
    let subject: TestSubject

    beforeAll(() => {
      option = new Option('-M | --max <n>')
      subject = new TestSubject()

      // @ts-expect-error testing (2445).
      subject.info.options = new Map([
        [option.long!, option],
        [option.short!, option]
      ])
    })

    it('should throw on long flag conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addOption(new Option(`-m | ${option.long}`))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('stack').match(/addOption/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it('should throw on short flag conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addOption(new Option(`${option.short} | --min`))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('stack').match(/addOption/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })
  })

  describe('#alias', () => {
    let alias1: string
    let alias2: string
    let aliases: Set<string>

    beforeAll(() => {
      alias1 = 'tz'
      alias2 = 't'
      aliases = new Set([alias1, alias2])
    })

    it('should add command aliases and return `this`', () => {
      // Arrange
      const subject: TestSubject = new TestSubject('timezone', {
        aliases: alias2
      })

      // Act
      const result = subject.alias(alias1)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.aliases').be.instanceof(Set)
      expect(result).to.have.nested.property('info.aliases').eql(aliases)
    })

    it('should return `null` if command has no aliases', () => {
      expect(new TestSubject().alias()).to.be.null
    })

    it('should return first command alias if command has aliases', () => {
      // Arrange
      const subject: TestSubject = new TestSubject('timezone', { aliases })

      // Act + Expect
      expect(subject.alias()).to.eq([...aliases][0]!)
    })
  })

  describe('#aliases', () => {
    it('should return list of command aliases', () => {
      // Act
      const result = new TestSubject().aliases()

      // Expect
      expect(result).to.be.instanceof(Set).and.empty
      expect(result).to.not.be.frozen
    })

    it('should set command aliases and return `this`', () => {
      // Arrange
      const aliases: Set<string> = new Set(['tz'])
      const property: string = 'info.aliases'
      const subject: TestSubject = new TestSubject('timezone', { aliases: 't' })

      // Act
      const result = subject.aliases(aliases)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(property).be.instanceof(Set)
      expect(result).to.have.nested.property(property).eql(aliases)
      expect(result).to.have.nested.property(property).not.eq(aliases)
    })
  })

  describe('#done', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it('should return command done callback', () => {
      expect(subject.done()).to.eq(noop)
    })

    it('should set command done callback and return `this`', () => {
      // Arrange
      const done: Action = vi.fn().mockName('done')

      // Act
      const result = subject.done(done)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.done', done)
    })
  })

  describe('#error', () => {
    let exit: MockInstance<TestSubject['exit']>
    let info: KronkError
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()

      info = new CommandError({
        code: 112,
        command: subject,
        id: eid.argument_after_variadic,
        reason: 'Cannot have argument after variadic argument'
      })

      exit = vi.spyOn(subject, 'exit')
    })

    it('should handle error object', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.error(info)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.eq(info)
      expect(exit).toHaveBeenCalledExactlyOnceWith(info)
    })
  })

  describe('#exiter', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it('should return command exit callback', () => {
      expect(subject.exiter()).to.eq(noop)
    })

    it('should set command exit callback and return `this`', () => {
      // Arrange
      const exit: Exit = vi.fn().mockName('exit')

      // Act
      const result = subject.exiter(exit)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.exit', exit)
    })
  })

  describe('#helpCommand', () => {
    it.each<[CommandInfo?]>([
      [],
      [{ helpCommand: false }]
    ])('should return help subcommand (%#)', info => {
      expect(new TestSubject(info).helpCommand()).toMatchSnapshot()
    })

    it.each<[HelpCommandData]>([
      [false],
      ['more'],
      [new TestSubject('info')],
      [{ description: 'show help for command', name: 'details' }]
    ])('should set help subcommand and return `this` (%#)', help => {
      // Arrange
      const prop: string = 'info.helpCommand'
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.helpCommand(help)

      // Expect
      expect(result).to.eq(subject)

      // Expect (conditional)
      if (help === false) {
        expect(result).to.have.nested.property(prop, null)
      } else if (TestSubject.isCommand(help)) {
        expect(result).to.have.nested.property(prop, help)
      } else {
        expect(result).to.have.nested.property(prop).not.eq(help)
        expect(result).to.have.nested.property(prop).be.instanceof(TestSubject)
      }
    })
  })

  describe('#helpOption', () => {
    it.each<[CommandInfo?]>([
      [],
      [{ helpOption: false }]
    ])('should return help option (%#)', info => {
      expect(new TestSubject(info).helpOption()).toMatchSnapshot()
    })

    it.each<[HelpOptionData]>([
      [false],
      ['--more'],
      [new Option('--info')],
      [{ description: 'show help for command', flags: '--details' }]
    ])('should set help option and return `this` (%#)', help => {
      // Arrange
      const property: string = 'info.helpOption'
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.helpOption(help)

      // Expect
      expect(result).to.eq(subject)

      // Expect (conditional)
      if (help === false) {
        expect(result).to.have.nested.property(property, null)
      } else if (isOption(help)) {
        expect(result).to.have.nested.property(property, help)
      } else {
        expect(result).to.have.nested.property(property).not.eq(help)
        expect(result).to.have.nested.property(property).be.instanceof(Option)
      }
    })
  })

  describe('#id', () => {
    it.each<[CommandName | undefined]>([
      [chars.empty],
      [chars.space],
      [chars.break],
      [undefined]
    ])('should return `null` if command does not have a name (%j)', name => {
      expect(new TestSubject({ name }).id()).to.be.null
    })

    it.each<[string]>([
      ['bump'],
      ['changelog ']
    ])('should return non-empty string if command has a name (%j)', name => {
      expect(new TestSubject({ name }).id()).to.eq(name.trim())
    })

    it('should set command name and return `this`', () => {
      // Arrange
      const name: CommandName = 'grease'
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.id(name)

      // Expect
      expect(result).to.eq(subject).and.have.nested.property('info.name', name)
    })
  })

  describe('#optionPriority', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it('should return option merge strategy', () => {
      expect(subject.optionPriority()).to.eq('local')
    })

    it('should set option merge strategy and return `this`', () => {
      // Arrange
      const priority: OptionPriority = 'global'

      // Act
      const result = subject.optionPriority(priority)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.optionPriority', priority)
    })
  })

  describe('#summary', () => {
    let subject: TestSubject
    let summary: string

    beforeAll(() => {
      summary = 'changelog generator'
    })

    beforeEach(() => {
      subject = new TestSubject('changelog')
    })

    it('should return command summary', () => {
      expect(subject.summary()).to.eq(null)
    })

    it('should set command summary and return `this`', () => {
      // Act
      const result = subject.summary(summary)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.summary', summary)
    })
  })

  describe('#toString', () => {
    let name: string

    beforeAll(() => {
      name = 'watch'
    })

    it('should return string representation of command', () => {
      expect(new TestSubject(name).toString()).to.eq(`Command(${name})`)
    })

    it('should return string representation of command without name', () => {
      expect(new TestSubject().toString()).to.eq('Command()')
    })
  })

  describe('#unknown', () => {
    it('should be unknown command-line argument strategy', () => {
      expect(new TestSubject()).to.have.property('unknown', false)
    })
  })

  describe('#unknowns', () => {
    it.each<Parameters<TestSubject['unknowns']>>([
      ['arguments'],
      ['options'],
      [false],
      [true]
    ])('should set unknowns strategy and return `this` (%j)', strategy => {
      // Arrange
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.unknowns(strategy)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.unknown', strategy)
    })
  })

  describe('#usage', () => {
    it.each<CommandInfo>([
      average,
      tribonacci
    ])('should return command usage (%#)', info => {
      expect(new TestSubject(info).usage()).toMatchSnapshot()
    })

    it('should set command usage and return `this`', () => {
      // Arrange
      const subject: TestSubject = new TestSubject()
      const usage: UsageData = { options: '[opts]' }

      // Act
      const result = subject.usage(usage)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.usage', usage)
    })
  })

  describe('#version', () => {
    it.each<string | null>([
      null,
      faker.system.semver()
    ])('should return command version (%#)', version => {
      expect(new TestSubject().version(version).version()).to.eq(version)
    })

    it.each<[VersionData]>([
      [pkg.version],
      [new VersionOption(pkg.version)],
      [{ version: pkg.version }]
    ])('should set version option and return `this` (%#)', info => {
      // Arrange
      const prop: string = 'info.version'
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.version(info)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(prop).be.instanceof(VersionOption)

      // Expect (conditional)
      if (isOption(info)) {
        expect(result).to.have.nested.property(prop, info)
      } else if (typeof info === 'string') {
        expect(result).to.have.nested.property(prop + '.version', info)
      } else {
        expect(result).to.have.nested.property(prop + '.version', info.version)
      }
    })
  })
})
