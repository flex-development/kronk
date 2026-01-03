/**
 * @file Type Tests - VersionOptionData
 * @module kronk/types/tests/unit-d/VersionOptionData
 */

import type TestSubject from '#types/version-option-data'
import type {
  Flags,
  Option,
  OptionData,
  OptionInfo
} from '@flex-development/kronk'

describe('unit-d:types/VersionOptionData', () => {
  it('should extract Flags', () => {
    expectTypeOf<TestSubject>().extract<Flags>().not.toBeNever()
  })

  it('should extract Option', () => {
    expectTypeOf<TestSubject>().extract<Option>().not.toBeNever()
  })

  it('should extract OptionData', () => {
    expectTypeOf<TestSubject>().extract<OptionData>().not.toBeNever()
  })

  it('should extract OptionInfo', () => {
    expectTypeOf<TestSubject>().extract<OptionInfo>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })
})
