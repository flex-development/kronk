/**
 * @file Type Tests - Process
 * @module kronk/interfaces/tests/unit-d/Process
 */

import type TestSubject from '#interfaces/process'
import type { ExitCode, ProcessEnv } from '@flex-development/kronk'
import type { WriteStream } from '@flex-development/log'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/Process', () => {
  it('should match [argv: string[]]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('argv').toEqualTypeOf<string[]>()
  })

  it('should match [env: ProcessEnv]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('env')
      .toEqualTypeOf<ProcessEnv>()
  })

  it('should match [exitCode?: ExitCode | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exitCode')
      .toEqualTypeOf<Nilable<ExitCode>>()
  })

  it('should match [stderr: WriteStream]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('stderr')
      .toEqualTypeOf<WriteStream>()
  })

  it('should match [stdout: WriteStream]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('stdout')
      .toEqualTypeOf<WriteStream>()
  })

  describe('exit', () => {
    type Subject = TestSubject['exit']

    describe('parameters', () => {
      it('should be callable with [(ExitCode | null | undefined)?]', () => {
        expectTypeOf<Subject>()
          .parameters
          .extract<[(ExitCode | null | undefined)?]>()
          .not.toBeNever()
      })
    })

    describe('returns', () => {
      it('should return never', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<never>()
      })
    })
  })
})
