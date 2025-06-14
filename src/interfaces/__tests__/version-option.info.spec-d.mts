/**
 * @file Type Tests - VersionOptionInfo
 * @module kronk/interfaces/tests/unit-d/VersionOptionInfo
 */

import type TestSubject from '#interfaces/version-option.info'
import type { Flags, OptionData, Version } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/VersionOptionInfo', () => {
  it('should extend OptionData', () => {
    expectTypeOf<TestSubject>().toExtend<OptionData>()
  })

  it('should match [flags?: Flags | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('flags')
      .toEqualTypeOf<Nilable<Flags>>()
  })

  it('should match [version: Version]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<Version>()
  })
})
