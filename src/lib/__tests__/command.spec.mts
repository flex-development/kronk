/**
 * @file Unit Tests - Command
 * @module kronk/lib/tests/unit/Command
 */

import keid from '#enums/keid'
import KronkError from '#errors/kronk.error'
import clamp from '#fixtures/commands/clamp'
import factorial from '#fixtures/commands/factorial'
import grease from '#fixtures/commands/grease'
import smallestNum from '#fixtures/commands/smallest-num'
import tribonacci from '#fixtures/commands/tribonacci'
import Argument from '#lib/argument'
import TestSubject from '#lib/command'
import Help from '#lib/help'
import Helpable from '#lib/helpable.abstract'
import Option from '#lib/option'
import VersionOption from '#lib/version.option'
import createProcess from '#tests/utils/create-process'
import errorSnapshot from '#tests/utils/error-snapshot'
import sfmt from '#tests/utils/sfmt'
import { faker } from '@faker-js/faker'
import type {
  CommandInfo,
  ExampleInfo,
  ExamplesData,
  Exit,
  HelpTextOptions,
  KronkErrorId,
  OptionPriority,
  Process,
  UsageData
} from '@flex-development/kronk'
import { SemVer } from 'semver'
import type { MockInstance } from 'vitest'

describe('unit:lib/Command', () => {
  describe('constructor', () => {
    it('should be help text candidate', () => {
      expect(new TestSubject()).to.be.instanceof(Helpable)
    })
  })

  describe('#addArgument', () => {
    it('should throw if argument is added after variadic argument', () => {
      // Arrange
      const subject: TestSubject = new TestSubject(smallestNum)
      let error!: KronkError

      // Act
      try {
        subject.addArgument(new Argument(sfmt.required({ variadic: true })))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', keid.argument_after_variadic)
      expect(error).to.have.property('stack').match(/addArgument/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it('should throw if required argument is added after optional', () => {
      // Arrange
      const id: KronkErrorId = keid.required_argument_after_optional
      const subject: TestSubject = new TestSubject(grease.subcommands.publish)
      let error!: KronkError

      // Act
      try {
        subject.addArgument(new Argument(sfmt.required({})))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', id)
      expect(error).to.have.property('stack').match(/addArgument/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })
  })

  describe('#addCommand', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(grease)
    })

    it('should throw on duplicate subcommand alias', () => {
      // Arrange
      const alias: string = grease.subcommands.bump.aliases
      const name: string = 'same-alias-as-subcommand'
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject(name, { aliases: alias }))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', keid.duplicate_subcommand)
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it('should throw on duplicate subcommand name', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject(grease.subcommands.distTag.name))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', keid.duplicate_subcommand)
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it.each<[CommandInfo?]>([
      [],
      [smallestNum],
      [Object.assign({}, smallestNum, { name: 'same-alias-as-parent' })]
    ])('should throw on invalid `command` name (%#)', info => {
      // Arrange
      const subject: TestSubject = new TestSubject(smallestNum)
      let error!: KronkError

      // Act
      try {
        subject.addCommand(new TestSubject(info))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', keid.invalid_subcommand_name)
      expect(error).to.have.property('stack').match(/addCommand/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })
  })

  describe('#addOption', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(clamp)
    })

    it('should throw on long flag conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addOption(new Option('--max <max>'))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', keid.duplicate_option)
      expect(error).to.have.property('stack').match(/addOption/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })

    it('should throw on short flag conflict', () => {
      // Arrange
      let error!: KronkError

      // Act
      try {
        subject.addOption(new Option('-m <m>'))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(KronkError)
      expect(error).to.have.property('id', keid.duplicate_option)
      expect(error).to.have.property('stack').match(/addOption/)
      expect(errorSnapshot(error)).toMatchSnapshot()
    })
  })

  describe('#alias', () => {
    it('should return `null` if command has no aliases', () => {
      expect(new TestSubject().alias()).to.be.null
    })

    it('should return first command alias if command has aliases', () => {
      expect(new TestSubject(smallestNum).alias()).to.eq(smallestNum.aliases)
    })
  })

  describe('#arguments', () => {
    it('should be able to define arguments with strings', () => {
      // Arrange
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.arguments(sfmt.required())

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.arguments').be.of.length(1)
    })
  })

  describe('#example', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it.each<[ExampleInfo | readonly string[] | string]>([
      [['bump', 'recommend']],
      ['--to=0ea3bcf737edf29d0a0ad3dc7702f29615e16b29'],
      [{ comment: 'write changelog to `--infile`', text: '-sw' }]
    ])('should add example and return `this` (%#)', info => {
      // Arrange
      const property: string = 'info.examples'

      // Act
      const result = subject.example(info)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(property).satisfy(Array.isArray)
      expect(result).to.have.nested.property(property).be.of.length(1)
    })
  })

  describe('#examples', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject()
    })

    it.each<[ExamplesData]>([
      ['--json'],
      [clamp.examples],
      [factorial.examples]
    ])('should add examples and return `this` (%#)', examples => {
      // Arrange
      const subject: TestSubject = new TestSubject({ ...clamp, examples: [] })

      // Act
      const result = subject.examples(examples)

      // Expect
      expect(result).to.eq(subject)
      expect(subject.examples()).to.have.property('length').be.gte(1)
    })

    it('should return list of command examples', () => {
      expect(subject.examples()).to.satisfy(Array.isArray).and.be.empty
    })
  })

  describe('#exit', () => {
    let e: KronkError
    let exiter: MockInstance<Exit>
    let process: Process
    let subject: TestSubject

    afterEach(() => {
      delete process.exitCode
    })

    beforeAll(() => {
      e = new KronkError('#exit')
      exiter = vi.fn().mockName('exiter')
      process = createProcess()
    })

    beforeEach(() => {
      subject = new TestSubject({ exit: exiter as unknown as Exit, process })
    })

    it('should not throw if `e` is not defined and exiter returns', () => {
      expect(subject.exit()).to.be.undefined
      expect(exiter).toHaveBeenCalledExactlyOnceWith(undefined)
      expect(exiter.mock.contexts[0]).to.eq(subject)
      expect(process).to.have.property('exitCode').be.undefined
    })

    it('should throw `e` if defined and `exiter` returns', () => {
      expect(() => subject.exit(e)).to.throw(e)
      expect(exiter).toHaveBeenCalledExactlyOnceWith(e)
      expect(exiter.mock.contexts[0]).to.eq(subject)
      expect(process).to.have.property('exitCode', e.code)
    })
  })

  describe('#findCommand', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject(grease)
    })

    it('should return `undefined` if command is not found', () => {
      expect(subject.findCommand('release')).to.be.undefined
    })
  })

  describe('#help', () => {
    let prepare: MockInstance<Help['prepare']>
    let subject: TestSubject

    beforeEach(() => {
      prepare = vi.spyOn(Help.prototype, 'prepare')
      subject = new TestSubject(grease)
    })

    it('should prepare help text utility', () => {
      // Arrange
      const columns: number = grease.help.columns + 70
      const options: HelpTextOptions = { columns }

      // Act
      subject.help(options)

      // Expect
      expect(subject).to.have.nested.property('info.help.columns', columns)
      expect(prepare).toHaveBeenCalledTimes(2)
      expect(prepare).toHaveBeenCalledWith(grease.help)
      expect(prepare).toHaveBeenLastCalledWith(options)
    })
  })

  describe('#helpCommand', () => {
    it('should configure help subcommand with `Command` instance', () => {
      // Arrange
      const help: TestSubject = new TestSubject('help')
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.helpCommand(help)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.helpCommand', help)
    })

    it.each<[CommandInfo?]>([
      [],
      [grease],
      [{ helpCommand: false }],
      [{ helpCommand: 'help' }]
    ])('should return help subcommand (%#)', info => {
      // Act
      const result = new TestSubject(info).helpCommand()

      // Expect
      expect(result ? result.snapshot() : result).toMatchSnapshot()
    })
  })

  describe('#helpOption', () => {
    it('should configure help option with `Option` instance', () => {
      // Arrange
      const help: Option = new Option('-h --help')
      const subject: TestSubject = new TestSubject({ helpOption: false })

      // Act
      const result = subject.helpOption(help)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.helpOption', help)
    })

    it.each<[CommandInfo?]>([
      [],
      [grease],
      [{ helpOption: false }],
      [{ helpOption: '--help' }]
    ])('should return help option (%#)', info => {
      // Act
      const result = new TestSubject(info).helpOption()

      // Expect
      expect(result ? String(result) : result).toMatchSnapshot()
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
    it.each<[CommandInfo]>([
      [clamp],
      [factorial],
      [grease],
      [tribonacci]
    ])('should return command usage (%#)', info => {
      expect(new TestSubject(info).usage()).toMatchSnapshot()
    })

    it('should set command usage and return `this`', () => {
      // Arrange
      const subject: TestSubject = new TestSubject()
      const usage: UsageData = { options: '[options]' }

      // Act
      const result = subject.usage(usage)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.usage', usage)
    })
  })

  describe('#version', () => {
    it('should configure version with `VersionOption` instance', () => {
      // Arrange
      const version: VersionOption = new VersionOption(faker.system.semver())
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.version(version)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.version', version)
    })

    it('should configure version with `SemVer` instance', () => {
      // Arrange
      const prop: string = 'info.version'
      const version: SemVer = new SemVer(faker.system.semver())
      const subject: TestSubject = new TestSubject()

      // Act
      const result = subject.version(version)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property(prop).be.instanceof(VersionOption)
      expect(result).to.have.nested.property(prop + '.version', version.version)
    })

    it.each<string | null>([
      null,
      faker.system.semver()
    ])('should return command version (%#)', version => {
      expect(new TestSubject({ version }).version()).to.eq(version)
    })
  })
})
