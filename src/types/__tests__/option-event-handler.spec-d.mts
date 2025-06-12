/**
 * @file Type Tests - OptionEventHandler
 * @module kronk/types/tests/unit-d/OptionEventHandler
 */

import type TestSubject from '#types/option-event-handler'
import type {
  Flags,
  Option,
  OptionValueSource,
  RawOptionValue
} from '@flex-development/kronk'

describe('unit-d:types/OptionEventHandler', () => {
  type T = Option & { version: string }
  type Subject = TestSubject<T>

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [T, RawOptionValue, (OptionValueSource | null | undefined)?, (Flags | null | undefined)?]', () => {
      // Arrange
      type Expect = [
        T,
        RawOptionValue,
        (OptionValueSource | null | undefined)?,
        (Flags | null | undefined)?
      ]

      // Expect
      expectTypeOf<Subject>().parameters.toEqualTypeOf<Expect>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
