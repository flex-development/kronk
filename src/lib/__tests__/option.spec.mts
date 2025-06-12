/**
 * @file Unit Tests - Option
 * @module kronk/lib/tests/unit/Option
 */

import chars from '#enums/chars'
import KronkError from '#errors/kronk.error'
import identity from '#internal/identity'
import TestSubject from '#lib/option'
import isKronkError from '#utils/is-kronk-error'
import type {
  DefaultInfo,
  Flags,
  OptionInfo,
  ParseArg
} from '@flex-development/kronk'

describe('unit:lib/Option', () => {
  it('should throw if no flags are found', () => {
    // Arrange
    let error!: Error

    // Act
    try {
      new TestSubject(chars.empty)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.be.instanceof(KronkError).and.satisfy(isKronkError)
    expect(error).to.have.property('cause').eql({ flags: chars.empty })
    expect(error).to.have.property('code', 1)
    expect(error).to.have.property('id', 'kronk/no-flags')
    expect(error).to.have.property('message').be.a('string')
    expect(error.message).toMatchSnapshot()
  })

  it.each<[Flags]>([
    ['-p [] | --parent <>'],
    ['-ws, --workspace']
  ])('should throw on invalid flags string part (%#)', flags => {
    // Arrange
    let error!: Error

    // Act
    try {
      new TestSubject(flags)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.be.instanceof(KronkError).and.satisfy(isKronkError)
    expect(error).to.have.property('cause').with.keys(['flags', 'part'])
    expect(error).to.have.nested.property('cause.flags', flags)
    expect(error).to.have.nested.property('cause.part').be.a('string')
    expect(error).to.have.property('code', 1)
    expect(error).to.have.property('id', 'kronk/invalid-flags')
    expect(error).to.have.property('message').be.a('string')
    expect(error.message).toMatchSnapshot()
  })

  describe('#boolean', () => {
    it('should be `false` if option is optional', () => {
      // Arrange
      const flags: Flags = '--debug [feat]'

      // Expect
      expect(new TestSubject(flags)).to.have.property('boolean', false)
    })

    it('should be `false` if option is required', () => {
      // Arrange
      const flags: Flags = '--log-level <level>'

      // Expect
      expect(new TestSubject(flags)).to.have.property('boolean', false)
    })

    it('should be `true` if option is not optional or required', () => {
      expect(new TestSubject('-h | --help')).to.have.property('boolean', true)
    })
  })

  describe('#choices', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('--drink-size <size>')
    })

    it('should return list of option choices', () => {
      expect(subject.choices()).to.be.instanceof(Set).and.empty
    })

    it('should set option choices and return `this`', () => {
      // Arrange
      const choices: Set<string> = new Set(['xl', 'l', 'm', 's'])

      // Act
      const result = subject.choices(choices)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.choices').eql(choices)
    })
  })

  describe('#default', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('--timeout [timeout]')
    })

    it('should return default value configuration', () => {
      expect(subject.default()).to.eql({ value: undefined })
    })

    it('should set default value configuration and return `this`', () => {
      // Arrange
      const info: DefaultInfo<number> = { value: 0 }

      // Act
      const result = subject.default(info)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.default', info)
    })
  })

  describe('#description', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('--esbuild.target')
    })

    it('should return option description', () => {
      expect(subject.description()).to.eq(chars.empty)
    })

    it('should set option description and return `this`', () => {
      // Arrange
      const description: URL = new URL('https://esbuild.github.io/api/#target')
      const expected: string = String(description)

      // Act
      const result = subject.description(description)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.description', expected)
    })
  })

  describe('#env', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('--color')
    })

    it('should return environment variable name', () => {
      expect(subject.env()).to.be.null
    })

    it('should set environment variable name and return `this`', () => {
      // Arrange
      const env: string = 'GREASE_COLOR'

      // Act
      const result = subject.env(env)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.env', env)
    })
  })

  describe('#event', () => {
    it('should be option event name', () => {
      // Arrange
      const flags: Flags = '--resolve.conditions <condition...>'
      const subject: TestSubject = new TestSubject(flags)

      // Expect
      expect(subject).have.property('event', 'option:' + subject.id)
    })
  })

  describe('#flags', () => {
    it('should be option flags string', () => {
      // Arrange
      const flags: Flags = ' --force '

      // Expect
      expect(new TestSubject(flags)).have.property('flags', flags.trim())
    })
  })

  describe('#hidden', () => {
    let flags: Flags

    beforeAll(() => {
      flags = '---gnu-style-hidden-option'
    })

    it('should be `false` if option is not hidden in help text', () => {
      expect(new TestSubject(flags)).to.have.property('hidden', false)
    })

    it('should be `true` if option is hidden in help text', () => {
      // Arrange
      const hidden: boolean = true
      const subject: TestSubject = new TestSubject({ flags, hidden })

      // Expect
      expect(subject).to.have.property('hidden', hidden)
    })
  })

  describe('#hide', () => {
    let flags: Flags

    beforeAll(() => {
      flags = '---gnu-style-hidden-option'
    })

    it.each<Parameters<TestSubject['hide']>>([
      [],
      [null],
      [undefined],
      [true]
    ])('should remove option from help and return `this` (%#)', hidden => {
      // Arrange
      const subject: TestSubject = new TestSubject(flags)

      // Act
      const result = subject.hide(hidden)

      // Expect
      expect(result).to.eq(subject)
      expect(subject).to.have.nested.property('info.hidden', true)
    })

    it('should show option in help and return `this`', () => {
      // Arrange
      const subject: TestSubject = new TestSubject({ flags, hidden: true })

      // Act
      const result = subject.hide(false)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.hidden', false)
    })
  })

  describe('#id', () => {
    it.each<[Flags]>([
      ['--parent <!>'],
      ['-s'],
      ['-w | --watch']
    ])('should be option id (%j)', flags => {
      expect(new TestSubject(flags).id).toMatchSnapshot()
    })
  })

  describe('#key', () => {
    let flags: Flags

    beforeAll(() => {
      flags = '--assets-dir'
    })

    it('should be property key (camelCased)', () => {
      expect(new TestSubject({ flags })).to.have.property('key', 'assetsDir')
    })

    it('should be property key (snake_case)', () => {
      // Arrange
      const info: OptionInfo = { flags, snakecase: true }

      // Expect
      expect(new TestSubject(info)).to.have.property('key', 'assets_dir')
    })
  })

  describe('#long', () => {
    it('should be `null` if option does not have long flag', () => {
      expect(new TestSubject('-s')).to.have.property('long', null)
    })

    it.each<[Flags]>([
      ['--workspace, --ws'],
      ['--ws, --workspace'],
      ['-T | --token <>']
    ])('should be non-empty string if option has long flag (%j)', flags => {
      // Arrange
      const subject: TestSubject = new TestSubject(flags)

      // Expect
      expect(subject).to.have.property('long').be.a('string').and.not.empty
      expect(subject.long).toMatchSnapshot()
    })
  })

  describe('#mandatory', () => {
    it.each<[Flags | OptionInfo]>([
      ['--color'],
      [{ flags: '--token <>' }],
      [{ flags: '--verbose', mandatory: false }]
    ])('should be `false` if option value is not mandatory (%#)', info => {
      expect(new TestSubject(info)).to.have.property('mandatory', false)
    })

    it.each<[Flags | OptionInfo]>([
      ['--token <!>'],
      [{ flags: '--token <!>', mandatory: false }],
      [{ flags: '--token <>', mandatory: true }]
    ])('should be `true` if option value mandatory (%#)', info => {
      expect(new TestSubject(info)).to.have.property('mandatory', true)
    })
  })

  describe('#optional', () => {
    it('should be `false` if `flags` does not use `[]` syntax', () => {
      expect(new TestSubject('--flag <>')).to.have.property('optional', false)
    })

    it('should be `true` if `flags` uses `[]` syntax', () => {
      expect(new TestSubject('--flag []')).to.have.property('optional', true)
    })
  })

  describe('#parser', () => {
    let parser: ParseArg<number, string>
    let subject: TestSubject

    beforeAll(() => {
      parser = vi.fn(Number.parseInt).mockName('parser')
    })

    beforeEach(() => {
      subject = new TestSubject('--timeout [timeout]')
    })

    it('should return option-argument parser', () => {
      // Act
      const result = subject.parser()

      // Expect
      expect(result).to.be.a('function').with.property('name', identity.name)
    })

    it('should set option-argument parser and return `this`', () => {
      // Act
      const result = subject.parser(parser)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.parser', parser)
    })
  })

  describe('#preset', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('-g | --gmt []')
    })

    it('should return option-argument preset', () => {
      expect(subject.preset()).to.be.null
    })

    it('should set option-argument preset and return `this`', () => {
      // Arrange
      const preset: string = 'true'

      // Act
      const result = subject.preset(preset)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.preset', preset)
    })
  })

  describe('#required', () => {
    it('should be `false` if `flags` does not use `<>` syntax', () => {
      expect(new TestSubject('--flag')).to.have.property('required', false)
    })

    it('should be `true` if `flags` uses `<>` syntax', () => {
      expect(new TestSubject('--flag <>')).to.have.property('required', true)
    })
  })

  describe('#short', () => {
    it('should be `null` if option does not have short flag', () => {
      expect(new TestSubject('--long-flag')).to.have.property('short', null)
    })

    it.each<[Flags]>([
      ['--workspace, --ws'],
      ['--ws, --workspace'],
      ['-t | --token <>']
    ])('should be non-empty string if option has short flag (%j)', flags => {
      // Arrange
      const subject: TestSubject = new TestSubject(flags)

      // Expect
      expect(subject).to.have.property('short').be.a('string').and.not.empty
      expect(subject.short).toMatchSnapshot()
    })
  })

  describe('#toString', () => {
    it('should return string representation of option', () => {
      // Arrange
      const subject: TestSubject = new TestSubject('-w | --watch []')

      // Act + Expect
      expect(subject.toString()).to.eq(`Option(${subject.flags})`)
    })
  })

  describe('#variadic', () => {
    it('should be `false` if `flags` does not use variadic syntax', () => {
      expect(new TestSubject('--flag...')).to.have.property('variadic', false)
    })

    it('should be `true` if `flags` uses variadic syntax', () => {
      expect(new TestSubject('--flag <...>')).to.have.property('variadic', true)
    })
  })
})
