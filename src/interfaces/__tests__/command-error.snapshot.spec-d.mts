/**
 * @file Type Tests - CommandErrorSnapshot
 * @module kronk/interfaces/tests/unit-d/CommandErrorSnapshot
 */

import type TestSubject from '#interfaces/command-error.snapshot'
import type { CommandSnapshot, KronkErrorJson } from '@flex-development/kronk'
import type { Nullable } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandErrorSnapshot', () => {
  it('should extend KronkErrorJson', () => {
    expectTypeOf<TestSubject>().toExtend<KronkErrorJson>()
  })

  it('should match [command: CommandSnapshot | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('command')
      .toEqualTypeOf<Nullable<CommandSnapshot>>()
  })
})
