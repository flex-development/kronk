/**
 * @file Type Tests - CommandName
 * @module kronk/types/tests/unit-d/CommandName
 */

import type TestSubject from '#types/command-name'
import type { Nullable } from '@flex-development/tutils'

describe('unit-d:types/CommandName', () => {
  it('should equal string | null', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<Nullable<string>>()
  })
})
