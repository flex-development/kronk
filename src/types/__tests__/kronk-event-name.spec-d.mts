/**
 * @file Type Tests - KronkEventName
 * @module kronk/types/tests/unit-d/KronkEventName
 */

import type TestSubject from '#types/kronk-event-name'
import type { KronkEventNameMap } from '@flex-development/kronk'

describe('unit-d:types/KronkEventName', () => {
  it('should equal KronkEventNameMap[keyof KronkEventNameMap]', () => {
    // Arrange
    type Expect = KronkEventNameMap[keyof KronkEventNameMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
