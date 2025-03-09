/**
 * @file Type Tests - ArgvSourceMap
 * @module kronk/interfaces/tests/unit-d/ArgvSourceMap
 */

import type TestSubject from '#interfaces/argv-source-map'

describe('unit-d:interfaces/ArgvSourceMap', () => {
  it('should match [node: "node"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('node').toEqualTypeOf<'node'>()
  })

  it('should match [user: "user"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('user').toEqualTypeOf<'user'>()
  })
})
