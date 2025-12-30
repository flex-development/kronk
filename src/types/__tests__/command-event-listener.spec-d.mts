/**
 * @file Type Tests - CommandEventListener
 * @module kronk/types/tests/unit-d/CommandEventListener
 */

import type TestSubject from '#types/command-event-listener'
import type { Command, CommandEvent } from '@flex-development/kronk'

describe('unit-d:types/CommandEventListener', () => {
  type T = Command & { parents: Command[] }
  type Subject = TestSubject<T>

  describe('parameters', () => {
    it('should be callable with [CommandEvent<T>]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[CommandEvent<T>]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<undefined>()
    })
  })
})
