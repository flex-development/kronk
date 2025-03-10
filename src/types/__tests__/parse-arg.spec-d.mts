/**
 * @file Type Tests - ParseArg
 * @module kronk/types/tests/unit-d/ParseArg
 */

import type TestSubject from '#types/parse-arg'

describe('unit-d:types/ParseArg', () => {
  type T = number
  type Value = string
  type Subject = TestSubject<T, Value>

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string, T | undefined]', () => {
      expectTypeOf<Subject>()
        .parameters
        .toEqualTypeOf<[string, T | undefined]>()
    })
  })

  describe('returns', () => {
    it('should return T', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<T>()
    })
  })
})
