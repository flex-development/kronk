/**
 * @file Unit Tests - isSubcommandInfo
 * @module kronk/utils/tests/unit/isSubcommandInfo
 */

import chars from '#enums/chars'
import Argument from '#lib/argument'
import Command from '#lib/command'
import Option from '#lib/option'
import sfmt from '#tests/utils/sfmt'
import testSubject from '#utils/is-subcommand-info'

describe('unit:utils/isSubcommandInfo', () => {
  it.each<Parameters<typeof testSubject>>([
    [{ name: null }],
    [chars.digit5],
    [new Argument(sfmt.required({ id: 'info' }))],
    [new Command('info')],
    [new Option('--info')],
    [null]
  ])('should return `false` if `value` does not look like info (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [{ name: chars.empty }],
    [{ name: 'tag' }]
  ])('should return `true` if `value` looks like info (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
