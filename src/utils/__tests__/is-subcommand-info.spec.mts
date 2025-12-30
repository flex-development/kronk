/**
 * @file Unit Tests - isSubcommandInfo
 * @module kronk/utils/tests/unit/isSubcommandInfo
 */

import chars from '#enums/chars'
import grease from '#fixtures/commands/grease'
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
  ])('should return `false` if `value` is not subcommand info (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [{ name: chars.empty }],
    [{ name: grease.subcommands.distTag.name }]
  ])('should return `true` if `value` is subcommand info (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
