/**
 * @file Type Tests - ParseableMetadata
 * @module kronk/interfaces/tests/unit-d/ParseableMetadata
 */

import type TestSubject from '#interfaces/parseable.metadata'
import type { ParseableInfo } from '@flex-development/kronk'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/ParseableMetadata', () => {
  it('should extend ParseableInfo', () => {
    expectTypeOf<TestSubject>().toExtend<ParseableInfo>()
  })

  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [required?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('required')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [variadic?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('variadic')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
