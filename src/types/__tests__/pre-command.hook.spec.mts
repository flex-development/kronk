/**
 * @file Type Tests - PreCommandHook
 * @module kronk/types/tests/unit-d/PreCommandHook
 */

import type TestSubject from '#types/pre-command.hook'
import type { KronkHookMap } from '@flex-development/kronk'

describe('unit-d:types/PreCommandHook', () => {
  it('should equal KronkHookMap["preCommand"]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<KronkHookMap['preCommand']>()
  })
})
