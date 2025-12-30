/**
 * @file Unit Tests - VersionOption
 * @module kronk/lib/tests/unit/VersionOption
 */

import Option from '#lib/option'
import TestSubject from '#lib/version.option'
import { faker } from '@faker-js/faker'
import type { Flags, Version } from '@flex-development/kronk'
import { SemVer } from 'semver'

describe('unit:lib/VersionOption', () => {
  describe.each<Version>([
    faker.system.semver(),
    new SemVer(faker.system.semver())
  ])('constructor(info) (%#)', version => {
    let description: string
    let flags: Flags
    let subject: TestSubject

    beforeAll(() => {
      description = 'output the version number'
      flags = '-V, --version'
      subject = new TestSubject({ description, flags, version })
    })

    it('should be instanceof `Option`', () => {
      expect(subject).to.be.instanceof(Option)
    })

    it('should set `#version`', () => {
      expect(subject).to.have.property('version', String(version))
    })

    it('should set description', () => {
      expect(subject.description()).to.eq(description)
    })

    it('should set flags', () => {
      expect(subject).to.have.property('flags', flags)
    })
  })

  describe.each<Version>([
    faker.system.semver(),
    new SemVer(faker.system.semver())
  ])('constructor(version) (%#)', version => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(version)
    })

    it('should be instanceof `Option`', () => {
      expect(subject).to.be.instanceof(Option)
    })

    it('should set `#version`', () => {
      expect(subject).to.have.property('version', String(version))
    })

    it('should set description', () => {
      expect(subject.description()).to.eq('print version number')
    })

    it('should set flags', () => {
      expect(subject).to.have.property('flags', '-v, --version')
    })
  })
})
