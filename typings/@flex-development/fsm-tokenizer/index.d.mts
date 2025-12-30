import tt from '#enums/tt'
import type kArgument from '#internal/k-argument'
import type kCommand from '#internal/k-command'
import type kOption from '#internal/k-option'
import type {} from '@flex-development/fsm-tokenizer'
import type { Command, Option } from '@flex-development/kronk'

declare module '@flex-development/fsm-tokenizer' {
  interface TokenInfo {
    /**
     * Whether a flag or operand was combined with a short flag.
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
     * Whether {@linkcode option} refers to global option.
     *
     * @internal
     */
    global?: boolean | null | undefined

    /**
     * The matched command option instance.
     *
     * @see {@linkcode Option}
     *
     * @internal
     */
    option?: Option | null | undefined

    /**
     * The token value.
     *
     * @internal
     */
    value?: string | undefined
  }

  interface TokenFields {
    /**
     * Whether an operand was attached to a flag using an equal (`=`) sign.
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
     * The current command.
     *
     * @internal
     */
    command?: Command | null | undefined

    /**
     * Whether a delimiter was tokenized.
     *
     * @internal
     */
    delimiter?: boolean | null | undefined
  }
}
