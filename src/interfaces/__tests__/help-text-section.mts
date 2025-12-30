/**
 * @file Type Tests - HelpTextSection
 * @module kronk/interfaces/tests/unit-d/HelpTextSection
 */

import type TestSubject from '#interfaces/help-text-section'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/HelpTextSection', () => {
  it('should match [content: readonly string[] | string | null | undefined', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('content')
      .toEqualTypeOf<Nilable<readonly string[] | string>>()
  })

  it('should match [title?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('title')
      .toEqualTypeOf<Nilable<string>>()
  })
})
