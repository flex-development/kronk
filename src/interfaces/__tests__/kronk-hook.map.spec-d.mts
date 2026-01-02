/**
 * @file Type Tests - KronkHookMap
 * @module kronk/interfaces/tests/unit-d/KronkHookMap
 */

import type TestSubject from '#interfaces/kronk-hook.map'
import type { Hook } from '@flex-development/kronk'

describe('unit-d:interfaces/KronkHookMap', () => {
  it('should match [postAction: Hook]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('postAction')
      .toEqualTypeOf<Hook>()
  })

  it('should match [preAction: Hook]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preAction')
      .toEqualTypeOf<Hook>()
  })

  it('should match [preCommand: Hook]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preCommand')
      .toEqualTypeOf<Hook>()
  })
})
