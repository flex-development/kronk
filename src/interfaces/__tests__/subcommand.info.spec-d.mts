/**
 * @file Type Tests - SubcommandInfo
 * @module kronk/interfaces/tests/unit-d/SubcommandInfo
 */

import type TestSubject from '#interfaces/subcommand.info'
import type { CommandInfo } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/SubcommandInfo', () => {
  it('should extend CommandInfo', () => {
    expectTypeOf<TestSubject>().toExtend<CommandInfo>()
  })

  it('should match [help?: null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('help')
      .toEqualTypeOf<Nilable<never>>()
  })

  it('should match [name: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('name').toEqualTypeOf<string>()
  })

  it('should match [process?: null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('process')
      .toEqualTypeOf<Nilable<never>>()
  })
})
