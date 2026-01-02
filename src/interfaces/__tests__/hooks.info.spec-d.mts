/**
 * @file Type Tests - HooksInfo
 * @module kronk/interfaces/tests/unit-d/HooksInfo
 */

import type TestSubject from '#interfaces/hooks.info'
import type {
  HooksData,
  PostActionHook,
  PreActionHook,
  PreCommandHook
} from '@flex-development/kronk'
import type { RequiredKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/HooksInfo', () => {
  it('should extend HooksData', () => {
    expectTypeOf<TestSubject>().toExtend<HooksData>()
  })

  it('should have all required keys', () => {
    expectTypeOf<RequiredKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [postAction: PostActionHook[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('postAction')
      .toEqualTypeOf<PostActionHook[]>()
  })

  it('should match [preAction: PreActionHook[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preAction')
      .toEqualTypeOf<PreActionHook[]>()
  })

  it('should match [preCommand: PreCommandHook[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preCommand')
      .toEqualTypeOf<PreCommandHook[]>()
  })
})
