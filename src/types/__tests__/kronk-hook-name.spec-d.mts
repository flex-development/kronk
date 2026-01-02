/**
 * @file Type Tests - KronkHookName
 * @module kronk/types/tests/unit-d/KronkHookName
 */

import type TestSubject from '#types/kronk-hook-name'
import type { KronkHookMap } from '@flex-development/kronk'

describe('unit-d:types/KronkHookName', () => {
  it('should equal Extract<keyof KronkHookMap, string>', () => {
    // Arrange
    type Expect = Extract<keyof KronkHookMap, string>

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
