/**
 * @file Type Tests - ParseArg
 * @module kronk/types/tests/unit-d/ParseArg
 */

import type TestSubject from '#types/parse-arg'

describe('unit-d:types/ParseArg', () => {
  type T = number
  type Previous = T | null
  type Subject = TestSubject<T, Previous>

  it('should match [this: unknown]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
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
