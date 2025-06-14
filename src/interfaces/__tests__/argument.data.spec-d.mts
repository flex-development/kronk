/**
 * @file Type Tests - ArgumentData
 * @module kronk/interfaces/tests/unit-d/ArgumentData
 */

import type TestSubject from '#interfaces/argument.data'
import type { DefaultInfo, List, ParseArg } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ArgumentData', () => {
  it('should match [choices?: List<string> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('choices')
      .toEqualTypeOf<Nilable<List<string>>>()
  })

  it('should match [default?: DefaultInfo | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('default')
      .toEqualTypeOf<Nilable<DefaultInfo>>()
  })

  it('should match [description?: URL | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('description')
      .toEqualTypeOf<Nilable<URL | string>>()
  })

  it('should match [parser?: ParseArg<any, any> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parser')
      .toEqualTypeOf<Nilable<ParseArg<any, any>>>()
  })
})
