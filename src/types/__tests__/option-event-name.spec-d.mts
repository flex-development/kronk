/**
 * @file Type Tests - OptionEventName
 * @module kronk/types/tests/unit-d/OptionEventName
 */

import type TestSubject from '#types/option-event-name'
import type { OptionEventNameMap } from '@flex-development/kronk'

describe('unit-d:types/OptionEventName', () => {
  it('should equal OptionEventNameMap[keyof OptionEventNameMap]', () => {
    // Arrange
    type Expect = OptionEventNameMap[keyof OptionEventNameMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
