/**
 * @file Unit Tests - Option
 * @module kronk/lib/tests/unit/Option
 */

import chars from '#enums/chars'
import keid from '#enums/keid'
import KronkError from '#errors/kronk.error'
import TestSubject from '#lib/option'
import Parseable from '#lib/parseable.abstract'
import isKronkError from '#utils/is-kronk-error'
import type {
  Flags,
  List,
  OptionInfo,
  OptionValues
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
    expect(error).to.have.property('id', keid.no_flags)
    expect(error).to.have.property('message').be.a('string')
    expect(error.message).toMatchSnapshot()
  })

  it.each<[Flags]>([
    ['-p [] | --parent <>'],
    ['-ws, --workspace'],
    ['-w --workspace --ws']
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
    expect(error).to.have.property('id', keid.invalid_flags)
    expect(error).to.have.property('message').be.a('string')
    expect(error.message).toMatchSnapshot()
  })

  describe('constructor', () => {
    it('should be parse candidate', () => {
      expect(new TestSubject('--loud')).to.be.instanceof(Parseable)
    })
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

  describe('#conflicts', () => {
    it('should return list of conflicting option names', () => {
      // Arrange
      const subject: TestSubject = new TestSubject('--log-level')

      // Act
      const result = subject.conflicts()

      // Expect
      expect(result).to.be.instanceof(Set).and.empty
      expect(result).to.not.be.frozen
    })

    it('should set conflicting option names and return `this`', () => {
      // Arrange
      const conflicts: List<string> | string = '--cmyk'
      const subject: TestSubject = new TestSubject('--rgb')

      // Act
      const result = subject.conflicts(conflicts)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.conflicts', conflicts)
    })
  })

  describe('#env', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject('--cwd')
    })

    it('should return environment variable names', () => {
      // Act
      const result = subject.env()

      // Expect
      expect(result).to.be.instanceof(Set).and.empty
      expect(result).to.not.be.frozen
    })

    it('should set environment variable names and return `this`', () => {
      // Arrange
      const env: List<string> = ['GREASE_CWD', 'PWD']

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

  describe('#implies', () => {
    it('should return map of implied option values', () => {
      expect(new TestSubject('--dairy').implies()).to.be.eql({})
    })

    it.each<[OptionValues | string, Flags]>([
      ['dairy', '-c, --cheese <type>'],
      [{ log_level: 'verbose' }, '--verbose']
    ])('should set implied option values and return `this` (%#)', (
      implies,
      flags
    ) => {
      // Arrange
      const prop: string = 'info.implies'
      const subject: TestSubject = new TestSubject(flags)

      // Act
      const result = subject.implies(implies)

      // Expect
      expect(result).to.eq(subject)

      // Expect (conditional)
      if (typeof implies === 'string') {
        expect(result).to.have.nested.property(prop).eql({ [implies]: true })
      } else {
        expect(result).to.have.nested.property(prop).eql(implies)
      }

      // Expect (snapshot)
      expect(result).toMatchSnapshot()
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

  describe('#mandate', () => {
    it('should be no-op if flags use mandatory option syntax', () => {
      // Arrange
      const subject: TestSubject = new TestSubject('--token <!>')

      // Act
      const result = subject.mandate(false)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.mandatory', true)
    })

    it.each<Parameters<TestSubject['mandate']>>([
      [],
      [null],
      [undefined],
      [true]
    ])('should make option mandatory and return `this` (%#)', mandatory => {
      // Arrange
      const subject: TestSubject = new TestSubject('--token <>')

      // Act
      const result = subject.mandate(mandatory)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.mandatory', true)
    })

    it('should make option not mandatory and return `this`', () => {
      // Arrange
      const subject: TestSubject = new TestSubject({
        flags: '--password <>',
        mandatory: true
      })

      // Act
      const result = subject.mandate(false)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.mandatory', false)
    })
  })

  describe('#mandatory', () => {
    it.each<[Flags | OptionInfo]>([
      ['--color'],
      [{ flags: '--password <>', mandatory: false }],
      [{ flags: '--token <>' }]
    ])('should be `false` if option is not mandatory (%#)', info => {
      expect(new TestSubject(info)).to.have.property('mandatory', false)
    })

    it.each<[Flags | OptionInfo]>([
      ['--token <!>'],
      [{ flags: '--token <!>', mandatory: false }],
      [{ flags: '--token <>', mandatory: true }]
    ])('should be `true` if option is mandatory (%#)', info => {
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
