/**
 * @file Type Tests - CommandErrorInfo
 * @module kronk/interfaces/tests/unit-d/CommandErrorInfo
 */

import type TestSubject from '#interfaces/command-error.info'
import type {
  Command,
  KronkErrorId,
  KronkErrorInfo
} from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandErrorInfo', () => {
  it('should extend KronkErrorInfo', () => {
    expectTypeOf<TestSubject>().toExtend<KronkErrorInfo>()
  })

  it('should match [command?: Command | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('command')
      .toEqualTypeOf<Nilable<Command>>()
  })

  it('should match [id: KronkErrorId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('id')
      .toEqualTypeOf<KronkErrorId>()
  })
})
