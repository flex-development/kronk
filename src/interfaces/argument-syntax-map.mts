/**
 * @file Interfaces - ArgumentSyntaxMap
 * @module kronk/interfaces/ArgumentSyntaxMap
 */

/**
 * Registry of strings used to define command and option arguments.
 *
 * Arguments are marked as required using empty angle brackets (`<>`) or by
 * wrapping an argument id in angle brackets: `<id>`.\
 * Optional arguments use empty square brackets (`[]`) or have their id wrapped
 * in square brackets: `[id]`.
 *
 * Variadic arguments are specified with an ellipsis wrapped in brackets (e.g.
 * `<...>`, `[...]`) or by appending the ellipsis to the end of the argument id
 * (`<value...>`, `[value...]`).
 *
 * Option-arguments can be marked as mandatory by appending an exclamation mark
 * to the end of the argument id: (`<!>`, `<id!>`, `<value!...>`).
 */
interface ArgumentSyntaxMap {
  optional: `[${string}]`
  optionalMandatory: `[${string}!]`
  optionalMandatoryVariadic: `[${string}!...]`
  optionalVariadic: `[${string}...]`
  required: `<${string}>`
  requiredMandatory: `<${string}!>`
  requiredMandatoryVariadic: `<${string}!...>`
  requiredVariadic: `<${string}...>`
}

export type { ArgumentSyntaxMap as default }
