/**
 * @file Type Tests - ExamplesData
 * @module kronk/types/tests/unit-d/ExamplesData
 */

import type TestSubject from '#types/examples-data'
import type { ExampleInfo, List } from '@flex-development/kronk'

describe('unit-d:types/ExamplesData', () => {
  it('should extract ExampleInfo', () => {
    expectTypeOf<TestSubject>().extract<ExampleInfo>().not.toBeNever()
  })

  it('should extract List<ExampleInfo | readonly string[] | string>', () => {
    expectTypeOf<TestSubject>()
      .extract<List<ExampleInfo | readonly string[] | string>>()
      .not.toBeNever()
  })

  it('should extract readonly string[]', () => {
    expectTypeOf<TestSubject>().extract<readonly string[]>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
