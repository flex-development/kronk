/**
 * @file Type Tests - CommandEventNameMap
 * @module kronk/interfaces/tests/unit-d/CommandEventNameMap
 */

import type TestSubject from '#interfaces/command-event-name.map'

describe('unit-d:interfaces/CommandEventNameMap', () => {
  it('should match [command: `command:${string}`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('command')
      .toEqualTypeOf<`command:${string}`>()
  })
})
