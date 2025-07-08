/**
 * @file eslint
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

import fldv from '@flex-development/eslint-config'

/**
 * eslint configuration.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...fldv.configs.node,
  {
    files: ['**/*.spec.mts'],
    rules: {
      'unicorn/prefer-ternary': 0
    }
  },
  {
    files: ['__fixtures__/commands/*.mts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 0
    }
  },
  {
    files: ['__fixtures__/process.mts'],
    rules: {
      'jsdoc/require-returns-check': 0
    }
  },
  {
    files: ['src/constructs/*.mts'],
    rules: {
      'unicorn/no-this-assignment': 0
    }
  },
  {
    files: ['src/enums/codes.mts'],
    rules: {
      'sort-keys': 0
    }
  },
  {
    files: ['src/interfaces/argument.info.mts'],
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': 0
    }
  }
]
