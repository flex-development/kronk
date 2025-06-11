/**
 * @file Reporters - VerboseReporter
 * @module tests/reporters/VerboseReporter
 * @see https://vitest.dev/advanced/reporters#exported-reporters
 */

import { colors, type Colors } from '@flex-development/colors'
import { getNames } from '@vitest/runner/utils'
import { ok } from 'devlop'
import type { RunnerTask } from 'vitest'
import type { TestCase, TestModule, TestSuite, Vitest } from 'vitest/node'
import { DefaultReporter, type Reporter } from 'vitest/reporters'

/**
 * Verbose reporter.
 *
 * @extends {DefaultReporter}
 * @implements {Reporter}
 */
class VerboseReporter extends DefaultReporter implements Reporter {
  /**
   * Color functions map.
   *
   * @protected
   * @instance
   * @member {Colors} colors
   */
  protected colors!: Colors

  /**
   * Create a new verbose reporter.
   */
  constructor() {
    super({ summary: false })
    this.renderSucceed = true
    this.verbose = true
  }

  /**
   * Format a project `name`.
   *
   * @protected
   * @instance
   *
   * @param {string | null | undefined} name
   *  The project name to format
   * @param {boolean | null | undefined} dim
   *  Dim formattted project name?
   * @return {string}
   *  Formatted project name
   */
  protected formatProjectName(
    name: string | null | undefined,
    dim?: boolean | null | undefined
  ): string {
    if (!name) return ''

    name = this.colors.magenta(`[${name}]`)
    if (dim) name = this.colors.dim(name)

    return name
  }

  /**
   * Get an indent string for `task`.
   *
   * @protected
   * @instance
   *
   * @param {RunnerTask} task
   *  The current runner task
   * @return {string}
   *  Indentation string
   */
  protected getIndentation(task: RunnerTask): string {
    return ' '.repeat(getNames(task).length * 2)
  }

  /**
   * Get a symbol representing `task`.
   *
   * @protected
   * @instance
   *
   * @param {RunnerTask} task
   *  The current runner task
   * @return {string}
   *  Task state symbol
   */
  protected getTaskSymbol(task: RunnerTask): string {
    if (task.mode === 'skip') return this.colors.dim(this.colors.gray('↓'))

    if (task.mode === 'todo') return this.colors.yellow('→')

    if (!task.result) return this.colors.gray('.')

    if (task.result.state === 'fail') {
      return this.colors.red(task.type === 'suite' ? '❯' : '✖')
    }

    if (task.result.state === 'pass') {
      return this.colors.green(task.meta.benchmark ? '·' : '✓')
    }

    return ''
  }

  /**
   * Initialize the reporter.
   *
   * @see {@linkcode Vitest}
   *
   * @public
   * @instance
   * @override
   *
   * @param {Vitest} ctx
   *  The reporter context
   * @return {undefined}
   */
  public override onInit(ctx: Vitest): undefined {
    return this.colors = colors, this.ctx = ctx, void this
  }

  /**
   * Print test `modules` after a test run.
   *
   * @public
   * @instance
   * @override
   *
   * @param {ReadonlyArray<TestModule>} modules
   *  List of test modules
   * @return {undefined}
   */
  // @ts-expect-error incorrectly typed 🙄.
  public override onTestRunEnd(modules: readonly TestModule[]): undefined {
    for (const module of modules) this.print(module)
    return void this
  }

  /**
   * Print a test case, module, or suite.
   *
   * @protected
   * @instance
   *
   * @param {TestCase | TestModule | TestSuite} reported
   *  The reported task
   * @return {undefined}
   */
  protected print(reported: TestCase | TestModule | TestSuite): undefined {
    ok('task' in reported, 'expected `reported.task`')

    /**
     * Whether the task was skipped.
     *
     * @const {boolean} skipped
     */
    const skipped: boolean = (
      reported.type === 'test'
        ? reported.result().state
        : reported.state()
    ) === 'skipped'

    /**
     * The current runner task.
     *
     * @const {RunnerTask} task
     */
    const task: RunnerTask = reported.task as RunnerTask

    /**
     * The formatted task string.
     *
     * @var {string} string
     */
    let string: string = this.getIndentation(task)

    // add task symbol.
    string += this.getTaskSymbol(task) + ' '

    // add project name, if any.
    if (reported.type === 'module' && reported.project.name) {
      string += this.formatProjectName(reported.project.name, skipped) + ' '
    }

    if (reported.type === 'test') {
      string += skipped ? this.colors.blackBright(reported.name) : reported.name
      this.log(string)
    } else {
      // add relative path to test module or suite name.
      string += skipped ? this.colors.blackBright(task.name) : task.name

      // add total number of tests.
      string += ` (${[...reported.children.allTests()].length})`

      // print task string.
      this.log(string)

      // print suites and/or tests.
      if (!skipped) {
        for (const subtask of reported.children.array()) {
          this.print(subtask)
        }
      }
    }

    return void this
  }

  /**
   * Print a test module.
   *
   * > 👉 **Note**: Does nothing.
   * > {@linkcode print} is called via {@linkcode onTestRunEnd} instead.
   *
   * @protected
   * @instance
   * @override
   *
   * @param {TestModule} module
   *  The test module to print
   * @return {undefined}
   */
  protected override printTestModule(module: TestModule): undefined {
    return void module
  }
}

export default VerboseReporter
