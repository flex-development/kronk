/**
 * @file Type Tests - HooksData
 * @module kronk/interfaces/tests/unit-d/HooksData
 */

import type TestSubject from '#interfaces/hooks.data'
import type {
  List,
  PostActionHook,
  PreActionHook,
  PreCommandHook
} from '@flex-development/kronk'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/HooksData', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [postAction?: PostActionHook | List<PostActionHook> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('postAction')
      .toEqualTypeOf<Nilable<PostActionHook | List<PostActionHook>>>()
  })

  it('should match [preAction?: PreActionHook | List<PreActionHook> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preAction')
      .toEqualTypeOf<Nilable<PreActionHook | List<PreActionHook>>>()
  })

  it('should match [preCommand?: PreCommandHook | List<PreCommandHook> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preCommand')
      .toEqualTypeOf<Nilable<PreCommandHook | List<PreCommandHook>>>()
  })
})
