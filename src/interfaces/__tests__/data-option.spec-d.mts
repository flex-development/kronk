/**
 * @file Type Tests - OptionData
 * @module kronk/interfaces/tests/unit-d/OptionData
 */

import type TestSubject from '#interfaces/data-option'
import type {
  DefaultInfo,
  List,
  ParseArg
} from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/OptionData', () => {
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

  it('should match [env?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('env')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [hidden?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hidden')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [mandatory?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mandatory')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [parser?: ParseArg<any, string> | ParseArg<any, string[]> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parser')
      .toEqualTypeOf<Nilable<ParseArg<any, string> | ParseArg<any, string[]>>>()
  })

  it('should match [preset?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preset')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [snakecase?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('snakecase')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
