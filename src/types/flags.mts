/**
 * @file Type Aliases - Flags
 * @module kronk/types/Flags
 */

/**
 * A string comprised of option flags.
 *
 * The flags string can contain at most 2 flags, typically one long flag and one
 * short or shortish (e.g. `--ws`) flag. Flags are separated by commas (`,`),
 * pipes (`|`), or spaces.
 *
 * A short flag is a hyphen — specifically [HYPHEN-MINUS `U+002D`][hyphen] —
 * followed by one case-insensitive alphanumeric character.
 * The letters themselves have [conventional meanings][meanings] and are worth
 * following, if possible.
 *
 * A long flag starts with two hyphens followed by one or more case-insensitive
 * alphanumeric characters. Using two hyphens prevents long flags from being
 * confused for grouped short options.
 * Hyphens and full stops ([FULL STOP `U+002E`][full-stop]) can be used to
 * separate words, as well as camelCase format.
 *
 * Option-arguments are marked as required using empty angle brackets (`<>`) or
 * by wrapping an argument id in angle brackets: `<id>`.\
 * Optional arguments use empty square brackets (`[]`) or have their id wrapped
 * in square brackets: `[id]`.
 *
 * Variadic arguments are specified with an ellipsis wrapped in brackets (e.g.
 * `<...>`, `[...]`) or by appending the ellipsis to the end of the argument id
 * (`<value...>`, `[value...]`). Option-arguments can also be marked as
 * mandatory by appending an exclamation mark to the end of the argument id:
 * (`<!>`, `<id!>`, `<value!...>`).
 *
 * [full-stop]: https://www.fileformat.info/info/unicode/char/002e/index.htm
 * [hyphen]: https://www.fileformat.info/info/unicode/char/002d/index.htm
 * [meanings]: http://www.catb.org/~esr/writings/taoup/html/ch10s05.html
 *
 * @example
 *  '--assetsDir <dir>'
 * @example
 *  '--config-loader <loader>'
 * @example
 *  '--debug [feat]'
 * @example
 *  '--esbuild.jsxDev'
 * @example
 *  '--force'
 * @example
 *  '--mode <mode>'
 * @example
 *  '--parent <!>'
 * @example
 *  '--resolve.conditions <condition!...>'
 * @example
 *  '--ws, --workspace'
 * @example
 *  '-D | --drink-size <size>'
 * @example
 *  '-w --watch'
 */
type Flags = string

export type { Flags as default }
