/**
 * @file Type Tests - ArgumentValueSourceMap
 * @module kronk/interfaces/tests/unit-d/ArgumentValueSourceMap
 */

import type TestSubject from '#interfaces/argument-value-source.map'

describe('unit-d:interfaces/ArgumentValueSourceMap', () => {
  it('should match [cli: "cli"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cli').toEqualTypeOf<'cli'>()
  })

  it('should match [default: "default"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('default')
      .toEqualTypeOf<'default'>()
  })
})
