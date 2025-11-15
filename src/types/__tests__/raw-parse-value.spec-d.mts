/**
 * @file Type Tests - RawParseValue
 * @module kronk/types/tests/unit-d/RawParseValue
 */

import type TestSubject from '#types/raw-parse-value'

describe('unit-d:types/RawParseValue', () => {
  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })

  it('should extract readonly string[]', () => {
    expectTypeOf<TestSubject>().extract<readonly string[]>().not.toBeNever()
  })
})
