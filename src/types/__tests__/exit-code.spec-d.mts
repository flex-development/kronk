/**
 * @file Type Tests - ExitCode
 * @module kronk/types/tests/unit-d/ExitCode
 */

import type TestSubject from '#types/exit-code'

describe('unit-d:types/ExitCode', () => {
  it('should extract number', () => {
    expectTypeOf<TestSubject>().extract<number>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
