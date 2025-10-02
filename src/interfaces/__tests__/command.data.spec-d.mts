/**
 * @file Type Tests - CommandData
 * @module kronk/interfaces/tests/unit-d/CommandData
 */

import type TestSubject from '#interfaces/command.data'
import type {
  Action,
  ArgumentsData,
  Command,
  Exit,
  List,
  OptionPriority,
  OptionsData,
  SubcommandsData,
  UnknownStrategy,
  UsageData,
  VersionData
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

  it('should match [arguments?: ArgumentsData | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('arguments')
      .toEqualTypeOf<Nilable<ArgumentsData>>()
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

  it('should match [options?: OptionsData | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<Nilable<OptionsData>>()
  })

  it('should match [parent?: Command | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<Nilable<Command>>()
  })

  it('should match [subcommands?: SubcommandsData | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommands')
      .toEqualTypeOf<Nilable<SubcommandsData>>()
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

  it('should match [usage?: UsageData | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('usage')
      .toEqualTypeOf<Nilable<UsageData>>()
  })

  it('should match [version?: VersionData | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<Nilable<VersionData>>()
  })
})
