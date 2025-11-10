/**
 * @file Unit Tests - Argument
 * @module kronk/lib/tests/unit/Argument
 */

import chars from '#enums/chars'
import keid from '#enums/keid'
import KronkError from '#errors/kronk.error'
import TestSubject from '#lib/argument'
import Parseable from '#lib/parseable.abstract'
import sfmt from '#tests/utils/sfmt'
import isKronkError from '#utils/is-kronk-error'
import type { ArgumentSyntax } from '@flex-development/kronk'

describe('unit:lib/Argument', () => {
  it('should throw if argument syntax is invalid', () => {
    // Arrange
    const syntax: string = sfmt.optional() + chars.space + sfmt.required()
    let error!: Error

    // Act
    try {
      new TestSubject(syntax)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.be.instanceof(KronkError).and.satisfy(isKronkError)
    expect(error).to.have.property('cause').with.keys(['syntax'])
    expect(error).to.have.nested.property('cause.syntax', syntax)
    expect(error).to.have.property('code', 1)
    expect(error).to.have.property('id', keid.invalid_argument_syntax)
    expect(error).to.have.property('message').be.a('string')
    expect(error.message).toMatchSnapshot()
  })

  describe('constructor', () => {
    it('should be parse candidate', () => {
      expect(new TestSubject(sfmt.required())).to.be.instanceof(Parseable)
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
