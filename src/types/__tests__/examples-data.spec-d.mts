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

  it('should extract List<ExampleInfo | string>', () => {
    expectTypeOf<TestSubject>()
      .extract<List<ExampleInfo | string>>()
      .not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
