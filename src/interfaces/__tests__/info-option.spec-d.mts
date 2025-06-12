/**
 * @file Type Tests - OptionInfo
 * @module kronk/interfaces/tests/unit-d/OptionInfo
 */

import type TestSubject from '#interfaces/info-option'
import type { Flags, OptionData } from '@flex-development/kronk'

describe('unit-d:interfaces/OptionInfo', () => {
  it('should extend OptionData', () => {
    expectTypeOf<TestSubject>().toExtend<OptionData>()
  })

  it('should match [flags: Flags]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('flags').toEqualTypeOf<Flags>()
  })
})
