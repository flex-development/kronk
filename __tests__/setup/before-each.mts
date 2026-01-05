/**
 * @file Test Setup - beforeEach
 * @module tests/setup/beforeEach
 */

import unique from '#parsers/unique'
import files from '#tests/parsers/files'

beforeEach(() => {
  files.list.clear()
  unique.list.clear()
})
