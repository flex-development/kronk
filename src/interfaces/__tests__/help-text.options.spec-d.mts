/**
 * @file Type Tests - HelpTextOptions
 * @module kronk/interfaces/tests/unit-d/HelpTextOptions
 */

import type TestSubject from '#interfaces/help-text.options'
import type { ColorizerOptions } from '@flex-development/colors'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/HelpTextOptions', () => {
  it('should extend ColorizerOptions', () => {
    expectTypeOf<TestSubject>().toExtend<ColorizerOptions>()
  })

  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [columns?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('columns')
      .toEqualTypeOf<Nilable<number>>()
  })
})
