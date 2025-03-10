/**
 * @file Unit Tests - Argument
 * @module kronk/lib/tests/unit/Argument
 */

import chars from '#enums/chars'
import KronkError from '#errors/kronk.error'
import identity from '#internal/identity'
import TestSubject from '#lib/argument'
import sfmt from '#tests/utils/sfmt'
import isKronkError from '#utils/is-kronk-error'
import type {
  ArgumentSyntax,
  DefaultInfo,
  ParseArg
} from '@flex-development/kronk'

describe('unit:lib/Argument', () => {
  it.each<[string]>([
    [chars.empty],
    [chars.ellipsis],
    [chars.lt + chars.space + chars.gt],
    [chars.lt + chars.gt + chars.ht + chars.leftBracket + chars.rightBracket],
    [chars.lt + chars.lowercaseN + chars.rightBracket],
    [chars.leftBracket + chars.crlf + chars.rightBracket]
  ])('should throw if argument syntax is invalid (%j)', syntax => {
    // Arrange
    let error!: Error

    // Act
    try {
      new TestSubject(syntax)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.be.instanceof(KronkError).and.satisfy(isKronkError)
    expect(error).to.have.property('cause').with.keys(['part', 'syntax'])
    expect(error).to.have.nested.property('cause.part').be.a('string')
    expect(error).to.have.nested.property('cause.syntax', syntax.trim())
    expect(error).to.have.property('code', 1)
    expect(error).to.have.property('id', 'kronk/invalid-argument-syntax')
    expect(error).to.have.property('message').be.a('string')
    expect(error.message).toMatchSnapshot()
  })

  describe('#choices', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject(sfmt.required())
    })

    it('should return list of argument choices', () => {
      expect(subject.choices()).to.be.instanceof(Set).and.empty
    })

    it('should set list of argument choices and return `this`', () => {
      // Arrange
      const choices: Set<string> = new Set(['large', 'medium', 'small'])

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
      subject = new TestSubject(sfmt.optional())
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
      subject = new TestSubject(sfmt.required())
    })

    it('should return argument description', () => {
      expect(subject.description()).to.eq(chars.empty)
    })

    it('should set argument description and return `this`', () => {
      // Arrange
      const description: string = 'the number to clamp'

      // Act
      const result = subject.description(description)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.description', description)
    })
  })

  describe('#id', () => {
    it('should be argument syntax id', () => {
      // Arrange
      const id: string = 'value'
      const syntax: ArgumentSyntax = sfmt.required({ id, variadic: true })

      // Expect
      expect(new TestSubject(syntax)).to.have.property('id', id)
    })
  })

  describe('#parser', () => {
    let parser: ParseArg<number>
    let subject: TestSubject

    beforeAll(() => {
      parser = vi.fn().mockReturnValue(13).mockName('parser')
    })

    beforeEach(() => {
      subject = new TestSubject(sfmt.required({ id: chars.lowercaseN }))
    })

    it('should return command-argument parser', () => {
      // Act
      const result = subject.parser()

      // Expect
      expect(result).to.be.a('function').with.property('name', identity.name)
    })

    it('should set command-argument parser and return `this`', () => {
      // Act
      const result = subject.parser(parser)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.parser', parser)
    })
  })

  describe('#required', () => {
    it.each<[ArgumentSyntax]>([
      [sfmt.optional()],
      [sfmt.optional({ variadic: true })]
    ])('should be `false` if argument is optional (%j)', syntax => {
      expect(new TestSubject(syntax)).to.have.property('required', false)
    })

    it.each<[ArgumentSyntax]>([
      [sfmt.required()],
      [sfmt.required({ variadic: true })]
    ])('should be `true` if argument is required (%j)', syntax => {
      expect(new TestSubject(syntax)).to.have.property('required', true)
    })
  })

  describe('#syntax', () => {
    it.each<[ArgumentSyntax]>([
      [sfmt.required()],
      [sfmt.required({ variadic: true })],
      [sfmt.optional()],
      [sfmt.optional({ variadic: true })]
    ])('should be argument syntax string (" %s ")', syntax => {
      // Arrange
      const info: string = chars.space + syntax + chars.space

      // Expect
      expect(new TestSubject(info)).have.property('syntax', syntax)
    })
  })

  describe('#toString', () => {
    it.each<[ArgumentSyntax]>([
      [sfmt.required()],
      [sfmt.required({ variadic: true })],
      [sfmt.optional()],
      [sfmt.optional({ variadic: true })]
    ])('should return string representation of argument (%j)', syntax => {
      // Arrange
      const subject: TestSubject = new TestSubject(syntax)

      // Act + Expect
      expect(subject.toString()).to.eq(`Argument(${subject.syntax})`)
    })
  })

  describe('#variadic', () => {
    it.each<[ArgumentSyntax]>([
      [sfmt.required()],
      [sfmt.optional()]
    ])('should be `false` if argument is not variadic (%j)', syntax => {
      expect(new TestSubject(syntax)).to.have.property('variadic', false)
    })

    it.each<[ArgumentSyntax]>([
      [sfmt.required({ variadic: true })],
      [sfmt.optional({ variadic: true })]
    ])('should be `true` if argument is variadic (%j)', syntax => {
      expect(new TestSubject(syntax)).to.have.property('variadic', true)
    })
  })
})
