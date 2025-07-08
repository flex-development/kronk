/**
 * @file Type Tests - CommandData
 * @module kronk/interfaces/tests/unit-d/CommandData
 */

import type TestSubject from '#interfaces/command.data'
import type {
  Action,
  ArgumentInfo,
  ArgumentSyntax,
  Command,
  CommandUsageData,
  Exit,
  Flags,
  List,
  OptionInfo,
  OptionPriority,
  SubcommandInfo,
  SubcommandsInfo,
  UnknownStrategy,
  Version,
  VersionOption,
  VersionOptionInfo
} from '@flex-development/kronk'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandData', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

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

  it('should match [arguments?: ArgumentInfo | List<ArgumentInfo | ArgumentSyntax> | string | null | undefined]', () => {
    // Arrange
    type Expect =
      | ArgumentInfo
      | List<ArgumentInfo | ArgumentSyntax>
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

  it('should match [options?: Flags | List<Flags | OptionInfo> | OptionInfo | null | undefined]', () => {
    // Arrange
    type Expect =
      | Flags
      | List<Flags | OptionInfo>
      | OptionInfo
      | null
      | undefined

    // Expect
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<Nilable<Expect>>()
  })

  it('should match [parent?: Command | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<Nilable<Command>>()
  })

  it('should match [subcommands?: SubcommandInfo | SubcommandsInfo | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommands')
      .toEqualTypeOf<Nilable<SubcommandInfo | SubcommandsInfo>>()
  })

  it('should match [summary?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('summary')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [unknown?: UnknownStrategy | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unknown')
      .toEqualTypeOf<Nilable<UnknownStrategy>>()
  })

  it('should match [usage?: CommandUsageData | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('usage')
      .toEqualTypeOf<Nilable<CommandUsageData>>()
  })

  it('should match [version?: Version | VersionOption | VersionOptionInfo | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<Nilable<Version | VersionOption | VersionOptionInfo>>()
  })
})
