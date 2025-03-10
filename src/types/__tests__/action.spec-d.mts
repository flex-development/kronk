/**
 * @file Type Tests - Action
 * @module kronk/types/tests/unit-d/Action
 */

import type TestSubject from '#types/action'
import type { Awaitable, Command, OptionValues } from '@flex-development/kronk'

describe('unit-d:types/Action', () => {
  type Args = [string, string]
  type Opts = OptionValues & { debug?: boolean | null | undefined }
  type Subject = TestSubject<Opts, Args>

  it('should match [this: Command]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<Command>()
  })

  describe('parameters', () => {
    it('should be callable with [Opts, ...Args]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[Opts, ...Args]>()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<null | undefined | void>', () => {
      expectTypeOf<Subject>()
        .returns
        .toEqualTypeOf<Awaitable<null | undefined | void>>()
    })
  })
})
