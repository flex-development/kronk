/**
 * @file Type Tests - ExitProcess
 * @module kronk/types/tests/unit-d/ExitProcess
 */

import type TestSubject from '#types/exit-process'
import type { ExitCode } from '@flex-development/kronk'

describe('unit-d:types/Exit', () => {
  it('should match [this: unknown]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
    it('should be callable with [(ExitCode | null | undefined)?]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[(ExitCode | null | undefined)?]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
