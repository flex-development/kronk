/**
 * @file Type Tests - OptionEventNameMap
 * @module kronk/interfaces/tests/unit-d/OptionEventNameMap
 */

import type TestSubject from '#interfaces/option-event-name-map'

describe('unit-d:interfaces/OptionEventNameMap', () => {
  it('should match [default: `option:${string}`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('default')
      .toEqualTypeOf<`option:${string}`>()
  })
})
