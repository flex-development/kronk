/**
 * @file Type Tests - OptionData
 * @module kronk/interfaces/tests/unit-d/OptionData
 */

import type TestSubject from '#interfaces/option.data'
import type {
  List,
  OptionValues,
  ParseableInfo
} from '@flex-development/kronk'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/OptionData', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should extend ParseableInfo', () => {
    expectTypeOf<TestSubject>().toExtend<ParseableInfo>()
  })

  it('should match [conflicts?: List<string> | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conflicts')
      .toEqualTypeOf<Nilable<List<string> | string>>()
  })

  it('should match [depends?: List<string> | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('depends')
      .toEqualTypeOf<Nilable<List<string> | string>>()
  })

  it('should match [env?: List<string> | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('env')
      .toEqualTypeOf<Nilable<List<string> | string>>()
  })

  it('should match [implies?: OptionValues | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('implies')
      .toEqualTypeOf<Nilable<OptionValues | string>>()
  })

  it('should match [mandatory?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mandatory')
      .toEqualTypeOf<Nilable<boolean>>()
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
