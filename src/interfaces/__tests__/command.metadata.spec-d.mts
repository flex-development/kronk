/**
 * @file Type Tests - CommandMetadata
 * @module kronk/interfaces/tests/unit-d/CommandMetadata
 */

import type { Skip, default as TestSubject } from '#interfaces/command.metadata'
import type {
  Argument,
  Command,
  CommandInfo,
  Option,
  VersionOption
} from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandMetadata', () => {
  it('should extend Omit<CommandInfo, Skip>', () => {
    expectTypeOf<TestSubject>().toExtend<Omit<CommandInfo, Skip>>()
  })

  it('should match [arguments: Argument[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('arguments')
      .toEqualTypeOf<Argument[]>()
  })

  it('should match [options: Map<string, Option>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<Map<string, Option>>()
  })

  it('should match [subcommands: Command[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommands')
      .toEqualTypeOf<Command[]>()
  })

  it('should match [version?: VersionOption | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<Nilable<VersionOption>>()
  })
})
