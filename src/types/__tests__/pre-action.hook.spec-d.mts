/**
 * @file Type Tests - PreActionHook
 * @module kronk/types/tests/unit-d/PreActionHook
 */

import type TestSubject from '#types/pre-action.hook'
import type { KronkHookMap } from '@flex-development/kronk'

describe('unit-d:types/PreActionHook', () => {
  it('should equal KronkHookMap["preAction"]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<KronkHookMap['preAction']>()
  })
})
