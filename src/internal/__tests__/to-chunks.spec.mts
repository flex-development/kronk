/**
 * @file Unit Tests - toChunks
 * @module kronk/internal/tests/unit/toChunks
 */

import chars from '#enums/chars'
import kArgument from '#internal/k-argument'
import kCommand from '#internal/k-command'
import kOption from '#internal/k-option'
import testSubject from '#internal/to-chunks'
import sfmt from '#tests/utils/sfmt'
import type { Flags } from '@flex-development/kronk'

describe('unit:internal/toChunks', () => {
  it.each<Parameters<typeof testSubject>>([
    [sfmt.required(), kArgument],
    [
      sfmt.required({ id: chars.lowercaseA }) +
      chars.ht +
      sfmt.required({ id: chars.lowercaseB }) +
      chars.ht +
      sfmt.optional({ id: chars.lowercaseC }),
      kArgument
    ],
    [
      'clone' +
      chars.space +
      sfmt.required({ id: 'source' }) +
      chars.space +
      sfmt.optional({ id: 'destination' }),
      kCommand
    ]
  ])('should return list of chunks (%j)', (string, context) => {
    // Act
    const result = testSubject(string, context)

    // Expect
    expect(result).to.be.an('array')
    expect(result).toMatchSnapshot()
  })

  describe('kOption context', () => {
    it.each<[string]>([
      [chars.empty],
      [chars.crlf],
      [chars.ht + chars.space.repeat(3)]
    ])('should return empty list if trimmed `string` is empty (%j)', string => {
      expect(testSubject(string, kOption)).to.be.an('array').of.length(0)
    })

    it.each<[Flags]>([
      ['--cwd <>'],
      ['--debug'],
      ['--gmt   []'],
      ['--ps   --preserve-symlinks'],
      ['--ws,--workspace []'],
      ['-m|--mask <mask>'],
      ['-p\t|\t--parent <!>'],
      ['-s   ,   --separator <char>']
    ])('should return list of flags `string` chunks (%j)', flags => {
      // Act
      const result = testSubject(flags, kOption)

      // Expect
      expect(result).to.be.an('array')
      expect(result).toMatchSnapshot()
    })
  })
})
