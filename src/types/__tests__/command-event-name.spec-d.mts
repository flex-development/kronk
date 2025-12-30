/**
 * @file Type Tests - CommandEventName
 * @module kronk/types/tests/unit-d/CommandEventName
 */

import type TestSubject from '#types/command-event-name'
import type { CommandEventNameMap } from '@flex-development/kronk'

describe('unit-d:types/CommandEventName', () => {
  it('should equal CommandEventNameMap[keyof CommandEventNameMap]', () => {
    // Arrange
    type Expect = CommandEventNameMap[keyof CommandEventNameMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
