/**
 * @file Test Setup - beforeEach
 * @module tests/setup/beforeEach
 */

import unique from '#parsers/unique'

beforeEach(() => {
  unique.list.clear()
})
