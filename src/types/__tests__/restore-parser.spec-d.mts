/**
 * @file Type Tests - RestoreParser
 * @module kronk/types/tests/unit-d/RestoreParser
 */

import type TestSubject from '#types/restore-parser'
import type { Awaitable } from '@flex-development/kronk'

describe('unit-d:types/RestoreParser', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with []', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[]>()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<null | undefined | void>', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<Awaitable<null | undefined | void>>()
    })
  })
})
