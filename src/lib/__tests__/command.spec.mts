/**
 * @file Unit Tests - Command
 * @module kronk/lib/tests/unit/Command
 */

import chars from '#enums/chars'
import average from '#fixtures/commands/average'
import clamp from '#fixtures/commands/clamp'
import date from '#fixtures/date'
import kCommand from '#internal/k-command'
import noop from '#internal/noop'
import Argument from '#lib/argument'
import TestSubject from '#lib/command'
import Option from '#lib/option'
import sfmt from '#tests/utils/sfmt'
import isArgument from '#utils/is-argument'
import isKronkError from '#utils/is-kronk-error'
import isOption from '#utils/is-option'
import type {
  Action,
  ArgumentInfo,
  ArgumentSyntax,
  CommandData,
  CommandInfo,
  CommandName,
  Exit,
  Flags,
  KronkError,
  List,
  OptionData,
  OptionInfo
} from '@flex-development/kronk'
import { omit } from '@flex-development/tutils'

describe('unit:lib/Command', () => {
  let isCommand: typeof TestSubject['isCommand']

  beforeAll(() => {
    isCommand = TestSubject.isCommand
  })

  describe('.isCommand', () => {
    it.each<Parameters<typeof TestSubject['isCommand']>>([
      [chars.digit3],
      [date],
      [new Argument('[]')],
      [new Option('--command')],
      [null]
    ])('should return `false` if `value` is not `Command` (%#)', value => {
      expect(isCommand(value)).to.be.false
    })

    it.each<Parameters<typeof TestSubject['isCommand']>>([
      [{ [kCommand]: true }],
      [new TestSubject()]
    ])('should return `true` if `value` looks like `Command` (%#)', value => {
      expect(isCommand(value)).to.be.true
    })
  })

  describe('#action', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject(average.name)
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
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject(average)
    })

    it('should throw if argument is added after variadic argument', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addArgument(new Argument(sfmt.required({ variadic: true })))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isKronkError)
      expect(error).to.have.property('id', 'kronk/argument-after-variadic')
      expect(error).to.have.property('message').be.a('string').and.not.empty
      expect(error).to.have.property('name', 'KronkError')
      expect(error).to.have.property('stack').match(/addArgument/)
      expect(omit(error.toJSON(), ['stack'])).toMatchSnapshot()
    })
  })

  describe('#addCommand', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()

      // @ts-expect-error [2445] testing.
      subject.info.subcommands = [
        new TestSubject({ aliases: 'tz', name: 'timezone' })
      ]
    })

    it('should throw on `command` alias conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject('timezones', { aliases: 'tz' }))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isKronkError)
      expect(error).to.have.property('id', 'kronk/duplicate-subcommand')
      expect(error).to.have.property('message').be.a('string').and.not.empty
      expect(error).to.have.property('name', 'KronkError')
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(omit(error.toJSON(), ['stack'])).toMatchSnapshot()
    })

    it('should throw on `command` name conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject('timezone'))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isKronkError)
      expect(error).to.have.property('id', 'kronk/duplicate-subcommand')
      expect(error).to.have.property('message').be.a('string').and.not.empty
      expect(error).to.have.property('name', 'KronkError')
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(omit(error.toJSON(), ['stack'])).toMatchSnapshot()
    })

    it('should throw on non-default `command` without `id`', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject())
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isKronkError)
      expect(error).to.have.property('id', 'kronk/no-subcommand-id')
      expect(error).to.have.property('message').be.a('string').and.not.empty
      expect(error).to.have.property('name', 'KronkError')
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(omit(error.toJSON(), ['stack'])).toMatchSnapshot()
    })
  })

  describe('#addOption', () => {
    let option: Option
    let subject: TestSubject

    beforeAll(() => {
      option = new Option('-M | --max <n>')
      subject = new TestSubject()

      // @ts-expect-error [2445] testing.
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
      expect(error).to.satisfy(isKronkError)
      expect(error).to.have.property('id', 'kronk/duplicate-option')
      expect(error).to.have.property('message').be.a('string').and.not.empty
      expect(error).to.have.property('name', 'KronkError')
      expect(error).to.have.property('stack').match(/addOption/)
      expect(omit(error.toJSON(), ['stack'])).toMatchSnapshot()
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
      expect(error).to.satisfy(isKronkError)
      expect(error).to.have.property('id', 'kronk/duplicate-option')
      expect(error).to.have.property('message').be.a('string').and.not.empty
      expect(error).to.have.property('name', 'KronkError')
      expect(error).to.have.property('stack').match(/addOption/)
      expect(omit(error.toJSON(), ['stack'])).toMatchSnapshot()
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
      expect(new TestSubject().aliases()).to.be.instanceof(Set).and.empty
    })

    it('should set command aliases and return `this`', () => {
      // Arrange
      const alias: string = 'tz'
      const aliases: Set<string> = new Set([alias])
      const subject: TestSubject = new TestSubject('timezone', { aliases: 't' })

      // Act
      const result = subject.aliases(alias)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.aliases').be.instanceof(Set)
      expect(result).to.have.nested.property('info.aliases').eql(aliases)
    })
  })

  describe('#argument', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject(clamp.name)
    })

    it.each<[Argument | ArgumentSyntax]>([
      [sfmt.required({ id: chars.lowercaseK })],
      [new Argument(sfmt.required({ id: chars.lowercaseN }))]
    ])('should add new argument and return `this` (%#)', info => {
      // Arrange
      const property: string = 'info.arguments'

      // Act
      const result = subject.argument(info)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(property).be.an('array')
      expect(result).to.have.nested.property(property).be.of.length(1)
      expect(result).to.have.nested.property(property).each.satisfy(isArgument)
    })
  })

  describe('#arguments', () => {
    it.each<[List<Argument | ArgumentInfo | string> | string]>([
      [
        [
          new Argument(sfmt.required({ id: chars.lowercaseA })),
          sfmt.required({ id: chars.lowercaseB }),
          { syntax: sfmt.required({ id: chars.lowercaseC }) }
        ]
      ],
      [
        chars.space +
        sfmt.required({ id: chars.lowercaseA }) +
        chars.ht +
        sfmt.required({ id: chars.lowercaseB }) +
        chars.ht +
        sfmt.required({ id: chars.lowercaseC }) +
        chars.lf
      ]
    ])('should add new arguments and return `this` (%#)', infos => {
      // Arrange
      const property: string = 'info.arguments'
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.arguments(infos)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(property).be.an('array')
      expect(result).to.have.nested.property(property).be.of.length(3)
      expect(result).to.have.nested.property(property).each.satisfy(isArgument)
    })

    it('should return list of `Argument` instances', () => {
      // Arrange
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.arguments()

      // Expect
      expect(result).to.be.an('array').that.is.empty
      expect(subject).to.have.nested.property('info.arguments').not.eq(result)
    })
  })

  describe('#command', () => {
    type Parameters =
      | [info: CommandInfo | CommandName | TestSubject]
      | [syntax: CommandName, info?: CommandData | null | undefined]

    const data: CommandData = { description: 'split a string into substrings' }
    const name: string = 'split'
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it.each<Parameters>([
      [average.name!],
      [average],
      [new TestSubject(name + chars.space + '<string>', data)]
    ])('should add new subcommand and return subcommand (%#)', (...params) => {
      // Arrange
      const property: string = 'info.subcommands'

      // Act
      const result = subject.command(params[0] as never, params[1])

      // Expect
      expect(result).to.satisfy(isCommand).and.not.eq(subject)
      expect(subject).to.have.nested.property(property).be.an('array')
      expect(subject).to.have.nested.property(property).be.of.length(1)
      expect(subject).to.have.nested.property(property).each.satisfy(isCommand)
    })
  })

  describe('#createArgument', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it('should return new `Argument` instance', () => {
      expect(subject.createArgument('<...>')).to.satisfy(isArgument)
    })
  })

  describe('#createCommand', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it('should return new `Command` instance', () => {
      expect(subject.createCommand('changelog')).to.satisfy(isCommand)
    })
  })

  describe('#createOption', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it('should return new `Option` instance', () => {
      expect(subject.createOption('--flag []')).to.satisfy(isOption)
    })
  })

  describe('#default', () => {
    it('should be `false` if command is not default subcommand', () => {
      expect(new TestSubject()).to.have.property('default', false)
    })

    it('should be `true` if command is default subcommand', () => {
      // Arrange
      const isDefault: boolean = true
      const subject: TestSubject = new TestSubject({ default: isDefault })

      // Expect
      expect(subject).to.have.property('default', isDefault)
    })
  })

  describe('#description', () => {
    let description: URL | string
    let subject: TestSubject

    beforeAll(() => {
      description = 'release workflow tool'
      description += '\n  https://github.com/flex-development/grease'
    })

    beforeEach(() => {
      subject = new TestSubject('grease')
    })

    it('should return command description', () => {
      expect(subject.description()).to.eq(chars.empty)
    })

    it('should set command description and return `this`', () => {
      // Act
      const result = subject.description(description)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.description', description)
    })
  })

  describe('#exiter', () => {
    let exit: Exit
    let subject: TestSubject

    beforeAll(() => {
      exit = vi.fn().mockName('exit')
    })

    beforeEach(() => {
      subject = new TestSubject()
    })

    it('should return command exit callback', () => {
      expect(subject.exiter()).to.eq(noop)
    })

    it('should set command exit callback and return `this`', () => {
      // Act
      const result = subject.exiter(exit)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.exit', exit)
    })
  })

  describe('#hidden', () => {
    it('should be `false` if command is not hidden in help text', () => {
      expect(new TestSubject()).to.have.property('hidden', false)
    })

    it('should be `true` if command is hidden in help text', () => {
      // Arrange
      const hidden: boolean = true

      // Expect
      expect(new TestSubject({ hidden })).to.have.property('hidden', hidden)
    })
  })

  describe('#hide', () => {
    it.each<Parameters<TestSubject['hide']>>([
      [],
      [null],
      [undefined],
      [true]
    ])('should remove command from help and return `this` (%#)', (...args) => {
      // Arrange
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.hide(...args)

      // Expect
      expect(result).to.eq(subject)
      expect(subject).to.have.nested.property('info.hidden', true)
    })

    it('should show command in help and return `this`', () => {
      // Arrange
      const subject: TestSubject = new TestSubject({ hidden: true })

      // Act
      const result = subject.hide(false)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.hidden', false)
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

  describe('#option', () => {
    type Parameters =
      | [info: Flags | Option | OptionInfo]
      | [flags: Flags, info?: OptionData | null | undefined]

    const data: OptionData = { default: { value: ',' } }
    const flags: Flags = '-s | --separator <char>'

    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('join')
    })

    it.each<Parameters>([
      [flags, data],
      [{ flags, ...data }],
      [new Option(flags, data)]
    ])('should add new option and return `this` (%#)', (...params) => {
      // Arrange
      const property: string = 'info.options'

      // Act
      const result = subject.option(params[0] as never, params[1])

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(property).be.instanceof(Map)
      expect(result).to.have.nested.property(property + '.size', 2)
      expect(result.options()).to.each.satisfy(isOption)
    })
  })

  describe('#options', () => {
    const max: Flags = '-M | --max <>'
    const min: Flags = '-m | --min <>'

    it.each<[List<Flags | Option | OptionInfo>]>([
      [[max, min]],
      [[{ flags: max }, new Option(min)]]
    ])('should add new options and return `this` (%#)', infos => {
      // Arrange
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.options(infos)

      // Expect
      expect(result).to.eq(subject)
      expect(result.options()).to.be.an('array').of.length(2)
      expect(result.options()).to.each.satisfy(isOption)
    })

    it('should return list of `Option` instances', () => {
      expect(new TestSubject().options()).to.be.an('array').that.is.empty
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

  describe('#version', () => {
    it.each<string | null>([
      null,
      faker.system.semver()
    ])('should return command version (%#)', version => {
      expect(new TestSubject().version(version).version()).to.eq(version)
    })
  })
})
