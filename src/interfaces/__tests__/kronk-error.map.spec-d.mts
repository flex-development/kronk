/**
 * @file Type Tests - KronkErrorMap
 * @module kronk/interfaces/tests/unit-d/KronkErrorMap
 */

import type TestSubject from '#interfaces/kronk-error.map'
import type { CommandError, KronkError } from '@flex-development/kronk'

describe('unit-d:interfaces/KronkErrorMap', () => {
  it('should match ["argument-after-variadic": KronkError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('argument-after-variadic')
      .toEqualTypeOf<KronkError>()
  })

  it('should match ["conflicting-option": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conflicting-option')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["duplicate-option": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('duplicate-option')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["duplicate-subcommand": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('duplicate-subcommand')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["excess-arguments": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('excess-arguments')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["invalid-argument": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('invalid-argument')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["invalid-argument-syntax": KronkError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('invalid-argument-syntax')
      .toEqualTypeOf<KronkError>()
  })

  it('should match ["invalid-flags": KronkError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('invalid-flags')
      .toEqualTypeOf<KronkError>()
  })

  it('should match ["invalid-subcommand-name": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('invalid-subcommand-name')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["missing-argument": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('missing-argument')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["missing-dependee-option": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('missing-dependee-option')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["missing-mandatory-option": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('missing-mandatory-option')
      .toEqualTypeOf<CommandError>()
  })

  it('should match ["no-flags": KronkError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('no-flags')
      .toEqualTypeOf<KronkError>()
  })

  it('should match ["required-argument-after-optional": KronkError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('required-argument-after-optional')
      .toEqualTypeOf<KronkError>()
  })

  it('should match ["unknown-option": CommandError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unknown-option')
      .toEqualTypeOf<CommandError>()
  })

  it('should match [error: KronkError]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('error')
      .toEqualTypeOf<KronkError>()
  })
})
