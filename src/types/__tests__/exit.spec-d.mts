/**
 * @file Type Tests - Exit
 * @module kronk/types/tests/unit-d/Exit
 */

import type TestSubject from '#types/exit'
import type { Command, CommandError, KronkError } from '@flex-development/kronk'

describe('unit-d:types/Exit', () => {
  it('should match [this: Command]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<Command>()
  })

  describe('parameters', () => {
    it('should be callable with [(CommandError | KronkError | null | undefined)?]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[(CommandError | KronkError | null | undefined)?]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
