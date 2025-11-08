/**
 * @file Type Tests - HelpOptionData
 * @module kronk/types/tests/unit-d/HelpOptionData
 */

import type TestSubject from '#types/help-option-data'
import type { Flags, Option, OptionInfo } from '@flex-development/kronk'

describe('unit-d:types/HelpOptionData', () => {
  it('should extract Flags', () => {
    expectTypeOf<TestSubject>().extract<Flags>().not.toBeNever()
  })

  it('should extract Option', () => {
    expectTypeOf<TestSubject>().extract<Option>().not.toBeNever()
  })

  it('should extract OptionInfo', () => {
    expectTypeOf<TestSubject>().extract<OptionInfo>().not.toBeNever()
  })

  it('should extract false', () => {
    expectTypeOf<TestSubject>().extract<false>().not.toBeNever()
  })
})
