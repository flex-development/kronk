/**
 * @file Type Tests - KronkErrorJson
 * @module kronk/interfaces/tests/unit-d/KronkErrorJson
 */

import type TestSubject from '#interfaces/kronk-error.json'
import type { KronkErrorCause, KronkErrorId } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/KronkErrorJson', () => {
  it('should match [additional: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('additional')
      .toEqualTypeOf<string[]>()
  })

  it('should match [cause?: KronkErrorCause | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cause')
      .toEqualTypeOf<Nilable<KronkErrorCause>>()
  })

  it('should match [code: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('code').toEqualTypeOf<number>()
  })

  it('should match [id: KronkErrorId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('id')
      .toEqualTypeOf<KronkErrorId>()
  })

  it('should match [message: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('message')
      .toEqualTypeOf<string>()
  })

  it('should match [stack?: string | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('stack')
      .toEqualTypeOf<Nilable<string>>()
  })
})
