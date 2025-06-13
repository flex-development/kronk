/**
 * @file Type Tests - Version
 * @module kronk/types/tests/unit-d/Version
 */

import type TestSubject from '#types/version'
import type { SemVer } from 'semver'

describe('unit-d:types/Version', () => {
  it('should extract SemVer', () => {
    expectTypeOf<TestSubject>().extract<SemVer>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
