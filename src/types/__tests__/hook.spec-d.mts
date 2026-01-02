/**
 * @file Type Tests - Hook
 * @module kronk/types/tests/unit-d/Hook
 */

import type TestSubject from '#types/hook'
import type { Awaitable, Command } from '@flex-development/kronk'

describe('unit-d:types/Hook', () => {
  type This = Command & { parent: true }
  type Runner = Command & { subcommand: true }
  type Subject = TestSubject<This, Runner>

  it('should match [this: This]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<This>()
  })

  describe('parameters', () => {
    it('should be callable with [Runner]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[Runner]>()
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
