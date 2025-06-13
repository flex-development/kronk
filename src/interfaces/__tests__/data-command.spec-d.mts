/**
 * @file Type Tests - CommandData
 * @module kronk/interfaces/tests/unit-d/CommandData
 */

import type TestSubject from '#interfaces/data-command'
import type {
  Action,
  Argument,
  ArgumentInfo,
  ArgumentSyntax,
  Command,
  CommandInfo,
  Exit,
  Flags,
  List,
  Option,
  OptionInfo,
  OptionPriority,
  UnknownStrategy,
  Version,
  VersionOption,
  VersionOptionInfo
} from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandData', () => {
  it('should match [action?: Action<any> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('action')
      .toEqualTypeOf<Nilable<Action<any>>>()
  })

  it('should match [aliases?: List<string> | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('aliases')
      .toEqualTypeOf<Nilable<List<string> | string>>()
  })

  it('should match [arguments?: Argument | ArgumentInfo | List<ArgumentInfo | ArgumentSyntax> | string | null | undefined]', () => {
    // Arrange
    type Expect =
      | Argument
      | ArgumentInfo
      | List<Argument | ArgumentInfo | ArgumentSyntax>
      | string
      | null
      | undefined

    // Expect
    expectTypeOf<TestSubject>()
      .toHaveProperty('arguments')
      .toEqualTypeOf<Nilable<Expect>>()
  })

  it('should match [default?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('default')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [description?: URL | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('description')
      .toEqualTypeOf<Nilable<URL | string>>()
  })

  it('should match [done?: Action<any> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('done')
      .toEqualTypeOf<Nilable<Action<any>>>()
  })

  it('should match [exit?: Exit | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exit')
      .toEqualTypeOf<Nilable<Exit>>()
  })

  it('should match [hidden?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hidden')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [optionPriority?: OptionPriority | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optionPriority')
      .toEqualTypeOf<Nilable<OptionPriority>>()
  })

  it('should match [options?: Flags | List<Flags | Option | OptionInfo> | Option | OptionInfo | null | undefined]', () => {
    // Arrange
    type Expect =
      | Flags
      | List<Flags | Option | OptionInfo>
      | Option
      | OptionInfo
      | null
      | undefined

    // Expect
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<Nilable<Expect>>()
  })

  it('should match [subcommands?: Command | CommandInfo | List<Command | CommandInfo | string> | string | null | undefined]', () => {
    // Arrange
    type Expect =
      | Command
      | CommandInfo
      | List<Command | CommandInfo | string>
      | string
      | null
      | undefined

    // Expect
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommands')
      .toEqualTypeOf<Nilable<Expect>>()
  })

  it('should match [unknown?: UnknownStrategy | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unknown')
      .toEqualTypeOf<Nilable<UnknownStrategy>>()
  })

  it('should match [version?: Version | VersionOption | VersionOptionInfo | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<Nilable<Version | VersionOption | VersionOptionInfo>>()
  })
})
