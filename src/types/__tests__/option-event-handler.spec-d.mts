/**
 * @file Type Tests - OptionEventHandler
 * @module kronk/types/tests/unit-d/OptionEventHandler
 */

import type TestSubject from '#types/option-event-handler'
import type { Option, OptionEvent } from '@flex-development/kronk'

describe('unit-d:types/OptionEventHandler', () => {
  type T = Option & { version: string }
  type Subject = TestSubject<T>

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [event: OptionEvent<T>]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[OptionEvent<T>]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
