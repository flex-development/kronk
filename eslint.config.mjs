/**
 * @file ESLint Configuration - Root
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

/**
 * Root eslint configuration object.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...(await import('./eslint.base.config.mjs')).default,
  {
    ignores: [
      '!**/__fixtures__/**/dist/',
      '!**/__fixtures__/node_modules/',
      '!**/typings/**/dist/',
      '**/*config.*.timestamp*',
      '**/.vitest-reports/',
      '**/.yarn/',
      '**/CHANGELOG.md',
      '**/LICENSE.md',
      '**/RELEASE_NOTES.md',
      '**/__tests__/reports/',
      '**/coverage/',
      '**/dist/',
      '**/tsconfig*temp.json'
    ]
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
    files: ['src/interfaces/info-argument.mts'],
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': 0
    }
  }
]
