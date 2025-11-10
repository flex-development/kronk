/**
 * @file Type Tests - OptionMetadata
 * @module kronk/interfaces/tests/unit-d/OptionMetadata
 */

import type TestSubject from '#interfaces/option.metadata'
import type { OptionInfo, ParseableMetadata } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/OptionMetadata', () => {
  it('should extend OptionInfo', () => {
    expectTypeOf<TestSubject>().toExtend<OptionInfo>()
  })

  it('should extend ParseableMetadata', () => {
    expectTypeOf<TestSubject>().toExtend<ParseableMetadata>()
  })

  it('should match [long: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('long')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [optional: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optional')
      .toEqualTypeOf<boolean>()
  })

  it('should match [required: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('required')
      .toEqualTypeOf<boolean>()
  })

  it('should match [short: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('short')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [variadic: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('variadic')
      .toEqualTypeOf<boolean>()
  })
})
