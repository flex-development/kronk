/**
 * @file Type Tests - OptionEventListener
 * @module kronk/types/tests/unit-d/OptionEventListener
 */

import type TestSubject from '#types/option-event-listener'
import type { Command, Option, OptionEvent } from '@flex-development/kronk'

describe('unit-d:types/OptionEventListener', () => {
  type T = Option & { parent?: Command | null }
  type Subject = TestSubject<T>

  describe('parameters', () => {
    it('should be callable with [OptionEvent<T>]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[OptionEvent<T>]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
