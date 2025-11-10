/**
 * @file Type Tests - HelpableInfo
 * @module kronk/interfaces/tests/unit-d/HelpableInfo
 */

import type TestSubject from '#interfaces/helpable.info'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/HelpableInfo', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [description?: URL | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('description')
      .toEqualTypeOf<Nilable<URL | string>>()
  })

  it('should match [hidden?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hidden')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
