/**
 * @file Type Tests - ParseArg
 * @module kronk/types/tests/unit-d/ParseArg
 */

import type TestSubject from '#types/parse-arg'

describe('unit-d:types/ParseArg', () => {
  type T = number
  type Subject = TestSubject<T>

  it('should match [this: unknown]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
    it('should be callable with [string, T?]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[string, T?]>()
    })
  })

  describe('returns', () => {
    it('should return T', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<T>()
    })
  })
})
