/**
 * @file Type Tests - HelpCommandData
 * @module kronk/types/tests/unit-d/HelpCommandData
 */

import type TestSubject from '#types/help-command-data'
import type {
  Command,
  CommandInfo,
  SubcommandInfo
} from '@flex-development/kronk'

describe('unit-d:types/HelpCommandData', () => {
  it('should extract Command', () => {
    expectTypeOf<TestSubject>().extract<Command>().not.toBeNever()
  })

  it('should extract CommandInfo', () => {
    expectTypeOf<TestSubject>().extract<CommandInfo>().not.toBeNever()
  })

  it('should extract SubcommandInfo', () => {
    expectTypeOf<TestSubject>().extract<SubcommandInfo>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
