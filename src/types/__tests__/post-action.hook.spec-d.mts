/**
 * @file Type Tests - PostActionHook
 * @module kronk/types/tests/unit-d/PostActionHook
 */

import type TestSubject from '#types/post-action.hook'
import type { KronkHookMap } from '@flex-development/kronk'

describe('unit-d:types/PostActionHook', () => {
  it('should equal KronkHookMap["postAction"]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<KronkHookMap['postAction']>()
  })
})
