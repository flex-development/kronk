/**
 * @file Type Tests - HelpCommandData
 * @module kronk/types/tests/unit-d/HelpCommandData
 */

import type TestSubject from '#types/help-command-data'
import type { Command, SubcommandInfo } from '@flex-development/kronk'

describe('unit-d:types/HelpCommandData', () => {
  it('should extract Command', () => {
    expectTypeOf<TestSubject>().extract<Command>().not.toBeNever()
  })

  it('should extract SubcommandInfo', () => {
    expectTypeOf<TestSubject>().extract<SubcommandInfo>().not.toBeNever()
  })

  it('should extract false', () => {
    expectTypeOf<TestSubject>().extract<false>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
