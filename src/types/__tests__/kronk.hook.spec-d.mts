/**
 * @file Type Tests - KronkHook
 * @module kronk/types/tests/unit-d/KronkHook
 */

import type TestSubject from '#types/kronk.hook'
import type { KronkHookMap } from '@flex-development/kronk'

describe('unit-d:types/KronkHook', () => {
  it('should equal KronkHookMap[keyof KronkHookMap]', () => {
    // Arrange
    type Expect = KronkHookMap[keyof KronkHookMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
