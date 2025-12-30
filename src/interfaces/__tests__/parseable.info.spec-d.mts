/**
 * @file Type Tests - ParseableInfo
 * @module kronk/interfaces/tests/unit-d/ParseableInfo
 */

import type TestSubject from '#interfaces/parseable.info'
import type {
  DefaultInfo,
  HelpableInfo,
  List,
  ParseArg
} from '@flex-development/kronk'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/ParseableInfo', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should extend HelpableInfo', () => {
    expectTypeOf<TestSubject>().toExtend<HelpableInfo>()
  })

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

  it('should match [parser?: ParseArg | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parser')
      .toEqualTypeOf<Nilable<ParseArg>>()
  })
})
