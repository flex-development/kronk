/**
 * @file Type Tests - KronkErrorInfo
 * @module kronk/interfaces/tests/unit-d/KronkErrorInfo
 */

import type TestSubject from '#interfaces/kronk-error.info'
import type {
  EmptyString,
  ExitCode,
  KronkErrorCause,
  KronkErrorId
} from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/KronkErrorInfo', () => {
  it('should match [additional?: string | string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('additional')
      .toEqualTypeOf<string | string[] | null | undefined>()
  })

  it('should match [cause?: KronkErrorCause | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cause')
      .toEqualTypeOf<Nilable<KronkErrorCause>>()
  })

  it('should match [code?: ExitCode | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('code')
      .toEqualTypeOf<ExitCode | null | undefined>()
  })

  it('should match [id?: EmptyString | KronkErrorId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('id')
      .toEqualTypeOf<Nilable<EmptyString | KronkErrorId>>()
  })

  it('should match [reason: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('reason').toEqualTypeOf<string>()
  })
})
