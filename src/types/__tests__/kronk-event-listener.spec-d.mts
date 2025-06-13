/**
 * @file Type Tests - KronkEventListener
 * @module kronk/types/tests/unit-d/KronkEventListener
 */

import type TestSubject from '#types/kronk-event-listener'
import type { OptionEvent } from '@flex-development/kronk'

describe('unit-d:types/KronkEventListener', () => {
  type T = OptionEvent
  type Subject = TestSubject<T>

  describe('parameters', () => {
    it('should be callable with [T]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[T]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
