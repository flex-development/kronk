import tt from '#enums/tt'
import type kArgument from '#internal/k-argument'
import type kCommand from '#internal/k-command'
import type kOption from '#internal/k-option'
import type {
  Command,
  CommandName,
  List,
  Option
} from '@flex-development/kronk'
import type {} from '@flex-development/vfile-tokenizer'

declare module '@flex-development/vfile-tokenizer' {
  interface TokenInfo {
    /**
     * Whether the flag or operand was combined with a short flag.
     *
     * @internal
     */
    combined?: boolean | null | undefined

    /**
     * Matched command instance.
     *
     * @see {@linkcode Command}
     *
     * @internal
     */
    command?: Command | null | undefined

    /**
     * Matched option instance.
     *
     * @see {@linkcode Option}
     *
     * @internal
     */
    option?: Option | null | undefined

    /**
     * Token value.
     *
     * @internal
     */
    value?: string | string[] | undefined
  }

  interface TokenFields {
    /**
     * Whether the operand was attached to a flag using an equal (`=`) sign.
     *
     * @internal
     */
    attached?: boolean | null | undefined

    /**
     * Argument syntax id.
     *
     * @internal
     */
    id?: string | null | undefined

    /**
     * Whether the token represents a long (or shortish) flag.
     *
     * @internal
     */
    long?: boolean | null | undefined

    /**
     * When tokenzing in an {@linkcode Option} context, whether mandatory
     * argument syntax was used.
     *
     * @internal
     */
    mandatory?: boolean | null | undefined

    /**
     * When tokenzing in an `Argument` or {@linkcode Option} context, whether
     * required argument syntax was used.
     *
     * @internal
     */
    required?: boolean | null | undefined

    /**
     * Whether the token represents a short flag.
     *
     * @internal
     */
    short?: boolean | null | undefined

    /**
     * When tokenzing in an `Argument` or {@linkcode Option} context, whether
     * variadic argument syntax was used.
     *
     * @internal
     */
    variadic?: boolean | null | undefined
  }

  interface TokenTypeMap {
    argtax: tt.argtax
    delimiter: tt.delimiter
    flag: tt.flag
    id: tt.id
    operand: tt.operand
  }

  interface TokenizeContext {
    /**
     * Whether we're tokenizing in an `Argument` instance context.
     *
     * @see {@linkcode kArgument}
     *
     * @internal
     */
    [kArgument]?: boolean | null | undefined

    /**
     * Whether we're tokenizing in an {@linkcode Command} instance context.
     *
     * @see {@linkcode kCommand}
     *
     * @internal
     */
    [kCommand]?: boolean | null | undefined

    /**
     * Whether we're tokenizing in an {@linkcode Option} instance context.
     *
     * @see {@linkcode kOption}
     *
     * @internal
     */
    [kOption]?: boolean | null | undefined

    /**
     * Whether a delimiter was tokenized.
     *
     * @internal
     */
    delimiter?: boolean | null | undefined

    /**
     * Find a command with a name or alias matching `x`.
     *
     * > 👉 **Note**: Only defined when tokenizing in a {@linkcode Command}
     * > instance context.
     *
     * @see {@linkcode CommandName}
     * @see {@linkcode Command}
     * @see {@linkcode List}
     *
     * @internal
     *
     * @this {void}
     *
     * @param {CommandName | List<CommandName>} x
     *  Command name, command alias, or list of names and/or aliases
     * @return {Command | undefined}
     *  Command with name or alias matching `x`
     */
    findCommand?(
      this: void,
      x: CommandName | List<CommandName>
    ): Command | undefined

    /**
     * Find an option with a flag matching `flag`.
     *
     * > 👉 **Note**: Only defined when tokenizing in a {@linkcode Command}
     * > instance context.
     *
     * @see {@linkcode Option}
     *
     * @internal
     *
     * @this {void}
     *
     * @param {string | null | undefined} flag
     *  The option flag to match
     * @return {Option | undefined}
     *  Option with the long or short flag `flag`
     */
    findOption?(this: void, flag: string | null | undefined): Option | undefined

    /**
     * Find a subcommand option with a flag matching `flag`.
     *
     * > 👉 **Note**: Only defined when tokenizing in a {@linkcode Command}
     * > instance context.
     *
     * @see {@linkcode Option}
     *
     * @internal
     *
     * @this {void}
     *
     * @param {string | null | undefined} flag
     *  The option flag to match
     * @return {Option | undefined}
     *  Subcommand option with the long or short flag `flag`
     */
    findSubOption?(
      this: void,
      flag: string | null | undefined
    ): Option | undefined
  }
}
