/**
 * @file Unit Tests - formatList
 * @module kronk/internal/tests/unit/formatList
 */

import testSubject from '#internal/format-list'

describe('unit:internal/formatList', () => {
  it.each<Parameters<typeof testSubject>>([
    [[]],
    [['debug']],
    [['commonjs', 'module']],
    [['cjs', 'esm', 'iife']],
    [['0', '1', '2', '3']],
    [['0', '1', '\'dts\'', 'false', 'true']]
  ])('should return list string (%#)', value => {
    expect(testSubject(value)).toMatchSnapshot()
  })
})
