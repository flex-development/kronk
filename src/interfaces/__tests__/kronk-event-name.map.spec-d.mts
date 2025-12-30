/**
 * @file Type Tests - KronkEventNameMap
 * @module kronk/interfaces/tests/unit-d/KronkEventNameMap
 */

import type TestSubject from '#interfaces/kronk-event-name.map'
import type {
  CommandEventNameMap,
  OptionEventNameMap
} from '@flex-development/kronk'

describe('unit-d:interfaces/KronkEventNameMap', () => {
  it('should extend CommandEventNameMap', () => {
    expectTypeOf<TestSubject>().toExtend<CommandEventNameMap>()
  })

  it('should extend OptionEventNameMap', () => {
    expectTypeOf<TestSubject>().toExtend<OptionEventNameMap>()
  })
})
