/**
 * @file Type Tests - CommandInfo
 * @module kronk/interfaces/tests/unit-d/CommandInfo
 */

import type TestSubject from '#interfaces/info-command'
import type { CommandData, CommandName } from '@flex-development/kronk'
import type { Optional } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandInfo', () => {
  it('should extend CommandData', () => {
    expectTypeOf<TestSubject>().toExtend<CommandData>()
  })

  it('should match [name?: CommandName | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('name')
      .toEqualTypeOf<Optional<CommandName>>()
  })
})
