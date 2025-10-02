/**
 * @file Type Tests - OptionsData
 * @module kronk/types/tests/unit-d/OptionsData
 */

import type TestSubject from '#types/options-data'
import type { Flags, List, OptionInfo } from '@flex-development/kronk'

describe('unit-d:types/OptionsData', () => {
  it('should extract Flags', () => {
    expectTypeOf<TestSubject>().extract<Flags>().not.toBeNever()
  })

  it('should extract List<Flags | OptionInfo>', () => {
    expectTypeOf<TestSubject>()
      .extract<List<Flags | OptionInfo>>()
      .not.toBeNever()
  })

  it('should extract OptionInfo', () => {
    expectTypeOf<TestSubject>().extract<OptionInfo>().not.toBeNever()
  })
})
