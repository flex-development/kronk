/**
 * @file Type Tests - CommandSnapshot
 * @module kronk/interfaces/tests/unit-d/CommandSnapshot
 */

import type TestSubject from '#interfaces/command.snapshot'
import type { CommandName, OptionValues } from '@flex-development/kronk'

describe('unit-d:interfaces/CommandSnapshot', () => {
  it('should match [ancestors: CommandName[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ancestors')
      .toEqualTypeOf<CommandName[]>()
  })

  it('should match [args: any[]]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('args').toEqualTypeOf<any[]>()
  })

  it('should match [argv: string[]]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('argv').toEqualTypeOf<string[]>()
  })

  it('should match [command: CommandName]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('command')
      .toEqualTypeOf<CommandName>()
  })

  it('should match [opts: OptionValues]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('opts')
      .toEqualTypeOf<OptionValues>()
  })

  it('should match [optsWithGlobals: OptionValues]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optsWithGlobals')
      .toEqualTypeOf<OptionValues>()
  })
})
