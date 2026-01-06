/**
 * @file Type Tests - ParseArg
 * @module kronk/interfaces/tests/unit-d/ParseArg
 */

import type TestSubject from '#interfaces/parse-arg'
import type { RestoreParser } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ParseArg', () => {
  type T = number
  type Previous = T | null
  type Subject = TestSubject<T, Previous>

  it('should match [restore?: RestoreParser | null | undefined]', () => {
    expectTypeOf<Subject>()
      .toHaveProperty('restore')
      .toEqualTypeOf<Nilable<RestoreParser>>()
  })

  describe('parameters', () => {
    it('should match [this: unknown]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<unknown>()
    })

    it('should be callable with [string, Previous?]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[string, Previous?]>()
    })
  })

  describe('returns', () => {
    it('should return T', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<T>()
    })
  })
})
