/**
 * @file Type Tests - VersionData
 * @module kronk/types/tests/unit-d/VersionData
 */

import type TestSubject from '#types/version-data'
import type {
  Version,
  VersionOption,
  VersionOptionInfo
} from '@flex-development/kronk'

describe('unit-d:types/VersionData', () => {
  it('should extract Version', () => {
    expectTypeOf<TestSubject>().extract<Version>().not.toBeNever()
  })

  it('should extract VersionOption', () => {
    expectTypeOf<TestSubject>().extract<VersionOption>().not.toBeNever()
  })

  it('should extract VersionOptionInfo', () => {
    expectTypeOf<TestSubject>().extract<VersionOptionInfo>().not.toBeNever()
  })
})
