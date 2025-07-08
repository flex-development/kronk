/**
 * @file Type Tests - SubcommandsInfo
 * @module kronk/types/tests/unit-d/SubcommandsInfo
 */

import type TestSubject from '#types/subcommands-info'
import type { CommandInfo } from '@flex-development/kronk'

describe('unit-d:types/SubcommandsInfo', () => {
  it('should equal Record<string, CommandInfo>', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<Record<string, CommandInfo>>()
  })
})
