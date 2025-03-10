/**
 * @file Type Tests - ParseOptions
 * @module kronk/interfaces/tests/unit-d/ParseOptions
 */

import type TestSubject from '#interfaces/parse-options'
import type { ArgvSource } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ParseOptions', () => {
  it('should match [from?: ArgvSource | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('from')
      .toEqualTypeOf<Nilable<ArgvSource>>()
  })
})
