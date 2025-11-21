/**
 * @file Unit Tests - Help
 * @module kronk/lib/tests/unit/Help
 */

import clamp from '#fixtures/commands/clamp'
import Command from '#lib/command'
import TestSubject from '#lib/help'
import { faker } from '@faker-js/faker'
import { isColorSupported } from '@flex-development/colors'
import type { CommandInfo } from '@flex-development/kronk'
import { isObjectPlain } from '@flex-development/tutils'

describe('unit:lib/Help', () => {
  describe('constructor', () => {
    it('should create custom help text utility', () => {
      // Arrange
      const color: boolean = faker.datatype.boolean()
      const columns: number = faker.number.int({ max: 120, min: 90 })

      // Act
      const result = new TestSubject({ color, columns })

      // Expect
      expect(result).to.have.property('columns', columns)
      expect(result).to.have.property('style').satisfy(isObjectPlain)
      expect(result).to.have.nested.property('style.color', color)
    })

    it('should create default help text utility', () => {
      // Act
      const result = new TestSubject()

      // Expect
      expect(result).to.have.property('columns', 80)
      expect(result).to.have.property('style').satisfy(isObjectPlain)
      expect(result).to.have.nested.property('style.color', isColorSupported())
    })
  })

  describe('#text', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it.each<[Command | CommandInfo]>([
      [clamp]
    ])('should return help text for `cmd` (%#)', info => {
      // Arrange
      const cmd: Command = info instanceof Command ? info : new Command(info)

      // Act
      const result = subject.text(cmd)

      // Expect
      expect(result).to.be.a('string')
      expect(result).toMatchSnapshot()
    })
  })
})
