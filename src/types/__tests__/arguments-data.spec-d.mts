/**
 * @file Type Tests - ArgumentsData
 * @module kronk/types/tests/unit-d/ArgumentsData
 */

import type TestSubject from '#types/arguments-data'
import type {
  ArgumentInfo,
  ArgumentSyntax,
  List
} from '@flex-development/kronk'

describe('unit-d:types/ArgumentsData', () => {
  it('should extract ArgumentInfo', () => {
    expectTypeOf<TestSubject>().extract<ArgumentInfo>().not.toBeNever()
  })

  it('should extract List<ArgumentInfo | ArgumentSyntax>', () => {
    expectTypeOf<TestSubject>()
      .extract<List<ArgumentInfo | ArgumentSyntax>>()
      .not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
