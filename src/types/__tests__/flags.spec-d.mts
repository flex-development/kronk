/**
 * @file Type Tests - Flags
 * @module kronk/types/tests/unit-d/Flags
 */

import type TestSubject from '#types/flags'

describe('unit-d:types/Flags', () => {
  it('should equal string', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<string>()
  })
})
