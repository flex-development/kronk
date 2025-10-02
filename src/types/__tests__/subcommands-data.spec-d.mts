/**
 * @file Type Tests - SubcommandsData
 * @module kronk/types/tests/unit-d/SubcommandsData
 */

import type TestSubject from '#types/subcommands-data'
import type { SubcommandInfo, SubcommandsInfo } from '@flex-development/kronk'

describe('unit-d:types/SubcommandsData', () => {
  it('should extract SubcommandInfo', () => {
    expectTypeOf<TestSubject>().extract<SubcommandInfo>().not.toBeNever()
  })

  it('should extract SubcommandsInfo', () => {
    expectTypeOf<TestSubject>().extract<SubcommandsInfo>().not.toBeNever()
  })
})
