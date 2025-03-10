/**
 * @file Type Tests - Exit
 * @module kronk/types/tests/unit-d/Exit
 */

import type TestSubject from '#types/exit'
import type { Command, CommandError } from '@flex-development/kronk'

describe('unit-d:types/Exit', () => {
  it('should match [this: Command]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<Command>()
  })

  describe('parameters', () => {
    it('should be callable with [(CommandError | null | undefined)?]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[(CommandError | null | undefined)?]>()
    })
  })

  describe('returns', () => {
    it('should return never | undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<never | undefined>()
    })
  })
})
