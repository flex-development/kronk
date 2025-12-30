/**
 * @file Type Tests - Write
 * @module kronk/types/tests/unit-d/Write
 */

import type TestSubject from '#types/write'

describe('unit-d:types/Write', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[string]>()
    })
  })

  describe('returns', () => {
    it('should return boolean | undefined | void', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<boolean | undefined | void>()
    })
  })
})
