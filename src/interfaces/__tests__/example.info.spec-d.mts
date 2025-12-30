/**
 * @file Type Tests - ExampleInfo
 * @module kronk/interfaces/tests/unit-d/ExampleInfo
 */

import type TestSubject from '#interfaces/example.info'
import type { CommandName } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ExampleInfo', () => {
  it('should match [command?: CommandName | readonly CommandName[] | false | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('command')
      .toEqualTypeOf<Nilable<CommandName | readonly CommandName[] | false>>()
  })

  it('should match [comment?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [env?: readonly string[] | string | null | undefined', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('env')
      .toEqualTypeOf<Nilable<readonly string[] | string>>()
  })

  it('should match [text: readonly string[] | string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('text')
      .toEqualTypeOf<readonly string[] | string>()
  })
})
