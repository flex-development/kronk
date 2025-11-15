/**
 * @file Type Tests - ExampleInfo
 * @module kronk/interfaces/tests/unit-d/ExampleInfo
 */

import type TestSubject from '#interfaces/example.info'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ExampleInfo', () => {
  it('should match [prefix?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('prefix')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [text: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('text')
      .toEqualTypeOf<string>()
  })
})
