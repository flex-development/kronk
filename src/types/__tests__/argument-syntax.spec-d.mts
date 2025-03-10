/**
 * @file Type Tests - ArgumentSyntax
 * @module kronk/types/tests/unit-d/ArgumentSyntax
 */

import type TestSubject from '#types/argument-syntax'
import type { ArgumentSyntaxMap } from '@flex-development/kronk'

describe('unit-d:types/ArgumentSyntax', () => {
  it('should equal ArgumentSyntaxMap[keyof ArgumentSyntaxMap]', () => {
    // Arrange
    type Expect = ArgumentSyntaxMap[keyof ArgumentSyntaxMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
