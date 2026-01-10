# kronk

[![ci](https://github.com/flex-development/kronk/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/flex-development/kronk/actions/workflows/ci.yml)
[![github release](https://img.shields.io/github/v/release/flex-development/kronk.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/kronk/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/kronk.svg)](https://npmjs.com/package/@flex-development/kronk)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/kronk.svg)](https://www.npmcharts.com/compare/@flex-development/kronk?interval=30)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/kronk)](https://packagephobia.now.sh/result?p=@flex-development/kronk)
[![codecov](https://codecov.io/gh/flex-development/kronk/graph/badge.svg?token=hddIvRiqq3)](https://codecov.io/gh/flex-development/kronk)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/kronk.svg)](LICENSE.md)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits\&logoColor=ffffff)](https://conventionalcommits.org)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript\&logoColor=ffffff)](https://typescriptlang.org)
[![vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat\&logo=vitest\&logoColor=ffffff)](https://vitest.dev)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

\:sparkles: a command line builder \:sparkles:

## Contents

- [What is this?](#what-is-this)
- [Install](#install)
- [:construction: Use](#use)
  - [Creating a *program*](#creating-a-program)
- [API](#api)
  - [`Argument(info)`](#argumentinfo)
    - [`Argument#id`](#argumentid)
    - [`Argument#syntax`](#argumentsyntax)
    - [`Argument#toString()`](#argumenttostring)
  - [`Command(info)`](#commandinfo)
    - [`Command#action([action])`](#commandactionaction)
    - [`Command#addArgument(argument)`](#commandaddargumentargument)
    - [`Command#addCommand(subcommand)`](#commandaddcommandsubcommand)
    - [`Command#addOption(option)`](#commandaddoptionoption)
    - [`Command#alias([alias])`](#commandaliasalias)
    - [`Command#aliases([aliases])`](#commandaliasesaliases)
    - [`Command#args`](#commandargs)
    - [`Command#argument(info[, data])`](#commandargumentinfo-data)
    - [`Command#argumentValue(index[, value][, source])`](#commandargumentvalueindex-value-source)
    - [`Command#argumentValueSource(index[, source])`](#commandoptionvaluesourcekey-source)
    - [`Command#arguments([infos])`](#commandargumentsinfos)
    - [`Command#argv`](#commandargv)
    - [`Command#command(info[, data])`](#commandcommandinfo-data)
    - [`Command#commands([infos])`](#commandcommandsinfos)
    - [`Command#copyInheritedSettings(parent)`](#commandcopyinheritedsettingsparent)
    - [`Command#createArgument(info[, data])`](#commandcreateargumentinfo-data)
    - [`Command#createCommand(info[, data])`](#commandcreatecommandinfo-data)
    - [`Command#createOption(info[, data])`](#commandcreateoptioninfo-data)
    - [`Command#default`](#commanddefault)
    - [`Command#defaultCommand`](#commanddefaultcommand)
    - [`Command#emit(event)`](#commandemitevent)
    - [`Command#emitCommand<T>(command)`](#commandemitcommandtcommand)
    - [`Command#emitOption<T>(option, value, source[, flags])`](#commandemitoptiontoption-value-source-flag)
    - [`Command#error(info)`](#commanderrorinfo)
    - [`Command#event`](#commandevent)
    - [`Command#example(info)`](#commandexampleinfo)
    - [`Command#examples([examples])`](#commandexamplesexamples)
    - [`Command#exit([e])`](#commandexite)
    - [`Command#exiter([exit])`](#commandexiterexit)
    - [`Command#findCommand(ref)`](#commandfindcommandref)
    - [`Command#findOption(flag[, direction])`](#commandfindoptionflag-direction)
    - [`Command#help([help])`](#commandhelphelp)
    - [`Command#helpCommand([help])`](#commandhelpcommandhelp)
    - [`Command#helpOption([help])`](#commandhelpoptionhelp)
    - [`Command#hook(hook[, fn])`](#commandhookhook-fn)
    - [`Command#hooks([hooks])`](#commandhookshooks)
    - [`Command#id([name])`](#commandidname)
    - [`Command#on<T>(event, listener[, options])`](#commandontevent-listener-options)
    - [`Command#option(info[, data])`](#commandoptioninfo-data)
    - [`Command#optionPriority([priority])`](#commandoptionprioritypriority)
    - [`Command#optionValue(key[, value][, source])`](#commandoptionvaluekey-value-source)
    - [`Command#optionValueSource(key[, source])`](#commandoptionvaluesourcekey-source)
    - [`Command#options([infos])`](#commandoptionsinfos)
    - [`Command#opts<T>()`](#commandoptst)
    - [`Command#optsWithGlobals<T>()`](#commandoptswithglobalst)
    - [`Command#parse<T>([argv][, options])`](#commandparsetargv-options)
    - [`Command#process`](#commandprocess)
    - [`Command#restore<T>()`](#commandrestoret)
    - [`Command#snapshot()`](#commandsnapshot)
    - [`Command#summary([summary])`](#commandsummarysummary)
    - [`Command#toString()`](#commandtostring)
    - [`Command#unknown`](#commandunknown)
    - [`Command#unknowns([strategy])`](#commandunknownsstrategy)
    - [`Command#uniqueCommands<T>()`](#commanduniquecommandst)
    - [`Command#uniqueOptions<T>()`](#commanduniqueoptionst)
    - [`Command#usage([usage])`](#commandusageusage)
    - [`Command#userOptions<T>([filter])`](#commanduseroptionstfilter)
    - [`Command#version([version])`](#commandversionversion)
    - [`Command#versionOption([version])`](#commandversionoptionversion)
  - [`CommandEvent<T>(command)`](#commandeventtcommand)
    - [`CommandEvent#command`](#commandeventcommand)
    - [`CommandEvent#id`](#commandeventid)
  - [`CommandError(info)`](#commanderrorinfo-1)
    - [`CommandError#command`](#commanderrorcommand)
    - [`CommandError#snapshot()`](#commanderrorsnapshot)
  - [`Help([options])`](#helpoptions)
    - [`Help#prepare([options])`](#helpprepareoptions)
    - [`Help#text(cmd)`](#helptextcmd)
  - [`Helpable([info])`](#helpableinfo)
    - [`Helpable#ancestors()`](#helpableancestors)
    - [`Helpable#description([description])`](#helpabledescriptiondescription)
    - [`Helpable#hidden`](#helpablehidden)
    - [`Helpable#hide([hidden])`](#helpablehidehidden)
    - [`Helpable#parent`](#helpableparent)
  - [`KronkError(info)`](#kronkerrorinfo)
    - [`KronkError#additional`](#kronkerroradditional)
    - [`KronkError#cause`](#kronkerrorcause)
    - [`KronkError#id`](#kronkerrorid)
    - [`KronkError#code`](#kronkerrorcode)
    - [`KronkError#toJSON()`](#kronkerrortojson)
    - [`KronkError#toString()`](#kronkerrortostring)
  - [`KronkEvent(id)`](#kronkeventid)
    - [`KronkEvent#id`](#kronkeventid-1)
    - [`KronkEvent#toString()`](#kronkeventtostring)
  - [`Option(info)`](#optioninfo)
    - [`Option#boolean`](#optionboolean)
    - [`Option#conflicts([conflicts])`](#optionconflictsconflicts)
    - [`Option#depends([depends])`](#optiondependsdepends)
    - [`Option#env([env])`](#optionenvenv)
    - [`Option#event`](#optionevent)
    - [`Option#flags`](#optionflags)
    - [`Option#id`](#optionid)
    - [`Option#implies([implies])`](#optionimpliesimplies)
    - [`Option#key`](#optionkey)
    - [`Option#long`](#optionlong)
    - [`Option#mandate([mandatory])`](#optionmandatemandatory)
    - [`Option#mandatory`](#optionmandatory)
    - [`Option#optional`](#optionoptional)
    - [`Option#preset([preset])`](#optionpresetpreset)
    - [`Option#short`](#optionshort)
    - [`Option#toString()`](#optiontostring)
  - [`OptionEvent<T>(option, value, source[, flag])`](#optioneventtoption-value-source-flag)
    - [`OptionEvent#flag`](#optioneventflag)
    - [`OptionEvent#id`](#optioneventid)
    - [`OptionEvent#option`](#optioneventoption)
    - [`OptionEvent#source`](#optioneventsource)
    - [`OptionEvent#value`](#optioneventvalue)
  - [`Parseable([info])`](#parseableinfo)
    - [`Parseable#choices([choices])`](#parseablechoiceschoices)
    - [`Parseable#default([info])`](#parseabledefaultinfo)
    - [`Parseable#id`](#parseableid)
    - [`Parseable#parser([parser])`](#parseableparserparser)
    - [`Parseable#required`](#parseablerequired)
    - [`Parseable#toString()`](#parseabletostring)
    - [`Parseable#variadic`](#parseablevariadic)
  - [`argumentValueSource`](#argumentvaluesource)
  - [`keid`](#keid)
  - [`optionValueSource`](#optionvaluesource)
- [Types](#types)
  - [`Action<[Opts][, Args]>`](#actionopts-args)
  - [`ArgumentData`](#argumentdata)
  - [`ArgumentInfo`](#argumentinfo-1)
  - [`ArgumentMetadata`](#argumentmetadata)
  - [`ArgumentSyntaxMap`](#argumentsyntaxmap)
  - [`ArgumentSyntax`](#argumentsyntax-1)
  - [`ArgumentValueSourceMap`](#argumentvaluesourcemap)
  - [`ArgumentValueSource`](#argumentvaluesource-1)
  - [`ArgumentValueSources`](#argumentvaluesources)
  - [`ArgumentsData`](#argumentsdata)
  - [`ArgvSourceMap`](#argvsourcemap)
  - [`ArgvSource`](#argvsource)
  - [`Awaitable<[T]>`](#awaitablet)
  - [`CommandData`](#commanddata)
  - [`CommandErrorInfo`](#commanderrorinfo-2)
  - [`CommandErrorSnapshot`](#commanderrorsnapshot-1)
  - [`CommandEventListener<[T]>`](#commandeventlistenert)
  - [`CommandEventNameMap`](#commandeventnamemap)
  - [`CommandEventName`](#commandeventname)
  - [`CommandInfo`](#commandinfo-1)
  - [`CommandMetadata`](#commandmetadata)
  - [`CommandName`](#commandname)
  - [`CommandSnapshot`](#commandsnapshot-1)
  - [`DefaultInfo`](#defaultinfo)
  - [`EmptyArray`](#emptyarray)
  - [`EmptyObject`](#emptyobject)
  - [`EmptyString`](#emptystring)
  - [`ExampleInfo`](#exampleinfo)
  - [`ExamplesData`](#examplesdata)
  - [`ExitCode`](#exitcode)
  - [`ExitProcess`](#exitprocess)
  - [`Exit`](#exit)
  - [`Flags`](#flags)
  - [`HelpCommandData`](#helpcommanddata)
  - [`HelpOptionData`](#helpoptiondata)
  - [`HelpTextOptions`](#helptextoptions)
  - [`HelpableInfo`](#helpableinfo-1)
  - [`Hook<[This][, Runner]>`](#hookthis-runner)
  - [`HooksData`](#hooksdata)
  - [`HooksInfo`](#hooksinfo)
  - [`KronkErrorCause`](#kronkerrorcause-1)
  - [`KronkErrorId`](#kronkerrorid-1)
  - [`KronkErrorInfo`](#kronkerrorinfo-1)
  - [`KronkErrorJson`](#kronkerrorjson)
  - [`KronkErrorMap`](#kronkerrormap)
  - [`KronkEventListener<[T]>`](#kronkeventlistenert)
  - [`KronkEventNameMap`](#kronkeventnamemap)
  - [`KronkHookMap`](#kronkhookmap)
  - [`KronkHookName`](#kronkhookname)
  - [`KronkHook`](#kronkhook)
  - [`List`](#list)
  - [`Numeric`](#numeric)
  - [`OptionData`](#optiondata)
  - [`OptionEventListener<[T]>`](#optioneventlistenert)
  - [`OptionEventNameMap`](#optioneventnamemap)
  - [`OptionEventName`](#optioneventname)
  - [`OptionInfo`](#optioninfo-1)
  - [`OptionMetadata`](#optionmetadata)
  - [`OptionPriority`](#optionpriority)
  - [`OptionValueSourceMap`](#optionvaluesourcemap)
  - [`OptionValueSource`](#optionvaluesource-1)
  - [`OptionValueSources`](#optionvaluesources)
  - [`OptionValues<[T]>`](#optionvaluest)
  - [`OptionsData`](#optionsdata)
  - [`ParseArg<[T][, Previous]>`](#parseargt-previous)
  - [`ParseOptions`](#parseoptions)
  - [`ParseUnknownResult`](#parseunknownresult)
  - [`ParseableInfo`](#parseableinfo-1)
  - [`ParseableMetadata`](#parseablemetadata)
  - [`PostActionHook`](#postactionhook)
  - [`PreActionHook`](#preactionhook)
  - [`PreCommandHook`](#precommandhook)
  - [`ProcessEnv`](#processenv)
  - [`Process`](#process)
  - [`RawOptionValue`](#rawoptionvalue)
  - [`RestoreParser`](#restoreparser)
  - [`SubcommandInfo`](#subcommandinfo)
  - [`SubcommandsData`](#subcommandsdata)
  - [`SubcommandsInfo`](#subcommandsinfo)
  - [`UnknownStrategy`](#unknownstrategy)
  - [`UsageData`](#usagedata)
  - [`UsageInfo`](#usageinfo)
  - [`VersionOptionData`](#versionoptiondata)
  - [`Version`](#version)
  - [`WriteStream`](#writestream)
  - [`Write`](#write)
- [Contribute](#contribute)

![run-the-command-kronk](./run-the-command-kronk.jpg)

## What is this?

`kronk` is a utility for building command-line applications in [node.js][nodejs] and [bun][].

## Install

This package is [ESM only][esm].

With [yarn][]:

```sh
yarn add @flex-development/kronk
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for info regarding installing from Git.
  </small>
</blockquote>

With [bun][]:

```sh
bun add @flex-development/kronk
```

<blockquote>
  <small>
    See <a href='https://bun.com/docs/cli/add'><code>bun add</code></a> for more details.
  </small>
</blockquote>

## Use

**TODO**: use

<blockquote>
  <small>
    See <a href='./__fixtures__/commands/'><code>__fixtures__/commands/</code></a>
    and <a href='./examples/'><code>examples/</code></a> for current usage examples.
  </small>
</blockquote>

### Creating a *program*

kronk exports a global `program` object convenient for quick programs.
This is used in the examples throughout this `README` for brevity.

```js
import { program } from '@flex-development/kronk'
```

For larger programs using kronk in multiple ways, including unit testing,
a [`Command`](#commandinfo) should be created.

```ts
import { Command } from '@flex-development/kronk'
const program: Command = new Command()
```

## API

### `Argument(info)`

A command argument (`class`).

#### Extends

- [`Parseable`](#parseableinfo)

#### Signatures

- `constructor(info: ArgumentInfo | string)`
- `constructor(info: string, data?: ArgumentData | null | undefined)`

#### Parameters

- `info` ([`ArgumentInfo`](#argumentinfo-1) | `string`)
  — argument info or syntax
- `data` ([`ArgumentData`](#argumentdata))
  — additional argument info

#### `Argument#id`

`string`

The argument syntax id.

#### `Argument#syntax`

[`ArgumentSyntax`](#argumentsyntax-1)

The normalized argument syntax string.

#### `Argument#toString()`

Get the argument as a human-readable string.

##### Returns

(`string`) String representation of [`this`](#argumentinfo) argument

### `Command([info])`

A command (`class`).

#### Extends

- [`Helpable`](#helpableinfo)

#### Signatures

- `constructor(info: CommandInfo | SubcommandInfo | string)`
- `constructor(info?: CommandInfo | string | null | undefined)`
- `constructor(info: string, data?: CommandData | null | undefined)`

#### Parameters

- `info` ([`CommandInfo`](#commandinfo-1) | `string`)
  — the command info or name
- `data` ([`CommandData`](#commanddata))
  — additional command info

#### `Command#action([action])`

Get or set the action callback.

##### Overloads

- `action(action: Action<any> | null | undefined): this`
- `action<Opts extends OptionValues = OptionValues, Args extends any[] = any[]>(): Action<Opts, Args>`

##### Type Parameters

- `Opts` ([`OptionValues`](#optionvaluest), optional)
  — the parsed command options
- `Args` (`any[]`, optional)
  — the parsed command arguments

##### Parameters

- `action` ([`Action<any>`](#actionopts-args) | `null` | `undefined`)
  — the callback to fire when the command is ran

##### Returns

([`Action<Opts, Args>`](#actionopts-args) | [`this`](#commandinfo)) The action callback or `this` command

#### `Command#addArgument(argument)`

Add a prepared `argument`.

##### Parameters

- `argument` ([`Argument`](#argumentinfo))
  — the argument instance to add

##### Returns

(`never` | [`this`](#commandinfo)) `this` command

##### Throws

([`KronkError`](#kronkerrorinfo)) If the last registered argument is variadic

#### `Command#addCommand(subcommand)`

Add a prepared `subcommand`.

> 👉 **Note**: See [`command`](#commandcommandinfo-data) for creating an attached subcommand
> that inherits settings from its [`parent`](#helpableparent).

##### Parameters

- `subcommand` ([`Command`](#commandinfo))
  — the command instance to add

##### Returns

(`never` | [`this`](#commandinfo)) `this` command

##### Throws

([`KronkError`](#kronkerrorinfo)) If `subcommand` does not have a valid name
or a subcommand with the same name or alias as `subcommand` already exists

#### `Command#addOption(option)`

Add a prepared `option`.

##### Parameters

- `option` ([`Option`](#optioninfo))
  — the option instance to add

##### Returns

(`never` | [`this`](#commandinfo)) `this` command

##### Throws

([`KronkError`](#kronkerrorinfo)) If an option with the same long or short flag as `option` already exists

#### `Command#alias([alias])`

Get an alias for the command or add a command alias.

> 👉 **Note**: This method can be called more than once to add multiple aliases.

##### Overloads

- `alias(alias: string): this`
- `alias(): CommandName`

##### Parameters

- `alias` (`string`)
  — an alias for the command

##### Returns

([`CommandName`](#commandname) | [`this`](#commandinfo)) Command alias or `this` command

#### `Command#aliases([aliases])`

Get or add aliases for the command.

##### Overloads

- `aliases(aliases: List<string> | string | null | undefined): this`
- `aliases(): Set<string>`

##### Parameters

- `aliases` ([`List<string>`](#list) | `string` | `null` | `undefined`)
  — an alias, or list of aliases, for the command

##### Returns

(`Set<string>` | [`this`](#commandinfo)) List of command aliases or `this` command

#### `Command#args`

`any[]`

Parsed command-line arguments.

#### `Command#argument(info[, data])`

Define an argument for the command.

##### Overloads

- `argument(info: ArgumentInfo | string): this`
- `argument(info: string, data?: ArgumentData | null | undefined): this`

##### Parameters

- `info` ([`ArgumentInfo`](#argumentinfo-1) | `string`)
  — argument info or syntax
- `data` ([`ArgumentData`](#argumentdata), optional)
  — additional argument info

##### Returns

([`this`](#commandinfo)) `this` command

#### `Command#argumentValue(index[, value][, source])`

Get or set an argument value.

##### Overloads

- `argumentValue(index: Numeric | number, value: unknown, source?: ArgumentValueSource | null | undefined): this`
- `argumentValue<T>(index: Numeric | number): T`

##### Type Parameters

- `T` (`any`)
  — the parsed argument value

##### Parameters

- `index` ([`Numeric`](#numeric) | `number`)
  — the position of the argument. a negative index will count back from the last argument when retrieving a value
- `value` (`unknown`)
  — the parsed argument value
- `source` ([`ArgumentValueSource`](#argumentvaluesource-1) | `null` | `undefined`, optional)
  — the source of the argument value

##### Returns

(`T` | [`this`](#commandinfo)) The stored argument value or `this` command

#### `Command#argumentValueSource(index[, source])`

Get or set an argument value source.

##### Overloads

- `argumentValueSource(index: Numeric | number, source: ArgumentValueSource | null | undefined): this`
- `argumentValueSource(index: Numeric | number): ArgumentValueSource | undefined`

##### Parameters

- `index` ([`Numeric`](#numeric) | `number`)
  — the position of the argument. a negative index will count back from the last argument when retrieving a source
- `source` ([`ArgumentValueSource`](#argumentvaluesource-1) | `null` | `undefined`)
  — the source of the argument value

##### Returns

([`ArgumentValueSource`](#argumentvaluesource-1) | [`this`](#commandinfo) | `undefined`)
The argument value source or `this` command

#### `Command#arguments([infos])`

Get a list of command arguments or batch define arguments for the command.

##### Overloads

- `arguments(infos: List<ArgumentInfo | string> | string): this`
- `arguments(): Argument[]`

##### Parameters

- `infos` ([`List<ArgumentInfo | string>`](#list) | `string`)
  — list of [argument info](#argumentinfo-1) and/or syntaxes, or a string containing argument syntaxes

##### Returns

([`Argument[]`](#argumentinfo) | [`this`](#commandinfo)) List of command arguments or `this` command

#### `Command#argv`

`string[]`

Raw command-line arguments.

#### `Command#command(info[, data])`

Define a subcommand.

##### Overloads

- `command(info: SubcommandInfo | string): Command`
- `command(info: string, data?: CommandData | null | undefined): Command`

##### Parameters

- `info` ([`SubcommandInfo`](#subcommandinfo) | `string`)
  — subcommand info or name
- `data` ([`CommandData`](#commanddata))
  — additional subcommand info

##### Returns

([`Command`](#commandinfo)) Subcommand instance

#### `Command#commands([infos])`

Batch define subcommands for the command or get a subcommands map.

Each key in the map is a subcommand name or alias and each value is a command.

##### Overloads

- `commands(infos: SubcommandsInfo): this`
- `commands(): Map<string, Command>`

##### Parameters

- `infos` ([`SubcommandsInfo`](#subcommandsinfo))
  — subcommands info

##### Returns

([`Map<string, Command> | this`](#commandinfo)) The subcommands map or `this` command

#### `Command#copyInheritedSettings(parent)`

Copy settings that are useful to have in common across `parent` and its subcommands.

> 👉 **Note**: This method is used internally via [`command`](#commandcommandinfo-data)
> so subcommands can inherit parent settings.

##### Parameters

- `parent` ([`Command`](#commandinfo))
  — the parent command to copy settings from

##### Returns

([`this`](#commandinfo)) `this` command

#### `Command#createArgument(info[, data])`

Create a new unattached argument.

##### Overloads

- `createArgument(info: ArgumentInfo | ArgumentSyntax): Argument`
- `createArgument(info: ArgumentSyntax, data?: ArgumentData | null | undefined): Argument`

##### Parameters

- `info` ([`ArgumentInfo`](#argumentinfo-1) | [`ArgumentSyntax`](#argumentsyntax-1))
  — argument info or syntax
- `data` ([`ArgumentData`](#argumentdata))
  — additional argument info

##### Returns

([`Argument`](#argumentinfo)) New argument instance

#### `Command#createCommand([info][, data])`

Create a new unattached command.

##### Overloads

- `createCommand(info?: CommandInfo | string | null | undefined): Command`
- `createCommand(info: string, data?: CommandData | null | undefined): Command`

##### Parameters

- `info` ([`CommandInfo`](#commandinfo-1) | `string`)
  — command info or name
- `data` ([`CommandData`](#commanddata))
  — additional command info

##### Returns

([`Command`](#commandinfo)) New command instance

#### `Command#createOption(info[, data])`

Create a new unattached option.

##### Overloads

- `createOption(info: Flags | OptionInfo): Option`
- `createOption(info: Flags, data?: OptionData | null | undefined): Option`

##### Parameters

- `info` ([`Flags`](#flags) | [`OptionInfo`](#optioninfo-1))
  — option info or flags
- `data` ([`OptionData`](#optiondata))
  — additional option info

##### Returns

([`Option`](#optioninfo)) New option instance

#### `Command#default`

`boolean`

Whether the command is the default subcommand of its [`parent`](#helpableparent).

#### `Command#defaultCommand`

[`Command`](#commandinfo) | `null` | `undefined`

The default command.

#### `Command#emit(event)`

Emit an `event`.

##### Parameters

- `event` ([`KronkEvent`](#kronkeventid))
  — the event to emit

##### Returns

(`boolean`) `true` if event has listeners, `false` otherwise

#### `Command#emitCommand<T>(command)`

Emit a parsed `command` event.

##### Type Parameters

- `T` ([`Command`](#commandinfo))
  — The command instance

##### Parameters

- `command` (`T`)
  — the command instance representing the parsed command

##### Returns

(`boolean`) `true` if event has listeners, `false` otherwise

#### `Command#emitOption<T>(option, value, source[, flag])`

Emit a parsed `option` event.

##### Signatures

- `emitOption<T extends Option>(option: T, value: RawOptionValue, source: OptionValueSource, flag?: Flags | null | undefined): boolean`
- `emitOption<T extends Option>(option: T, value: unknown, source: optionValueSource.implied, flag?: Flags | null | undefined): boolean`

##### Type Parameters

- `T` ([`Option`](#optioninfo))
  — The option instance

##### Parameters

- `option` (`T`)
  — the option instance representing the parsed option
- `value` ([`RawOptionValue`](#rawoptionvalue))
  — the `option` value
- `source` ([`OptionValueSource`](#optionvaluesource-1))
  — the source of the option `value`
- `flag` ([`Flags`](#flags), optional)
  — the parsed `option` flag

##### Returns

(`boolean`) `true` if event has listeners, `false` otherwise

#### `Command#error(info)`

Display an error message and exit.

##### Parameters

- `info` ([`CommandErrorInfo`](#commanderrorinfo-2) | [`KronkError`](#kronkerrorinfo))
  — info about the error or the error to display

##### Returns

(`never`) Never, exits erroneously

#### `Command#event`

[`CommandEventName`](#commandeventname)

The event name for the command.

#### `Command#example(info)`

Add an example for the command.

> 👉 **Note**: This method can be called more than once to add multiple examples.

##### Parameters

- `info` ([`ExampleInfo`](#exampleinfo) | `string`)
  — the example info or text

##### Returns

([`this`](#commandinfo)) `this` command

#### `Command#examples([examples])`

Get or add examples for the command.

##### Overloads

- `examples(examples: ExamplesData | null | undefined): this`
- `examples(): ExampleInfo[]`

##### Parameters

- `examples` ([`ExamplesData`](#examplesdata) | `null` | `undefined`)
  — example info, example text, or a list of such

##### Returns

([`ExampleInfo[]`](#exampleinfo) | [`this`](#commandinfo)) List of examples or `this` command

#### `Command#exit([e])`

Exit the process.

> 👉 **Note**: The exit code (`process.exitCode`) is set, but `process.exit` is **not** called.
> To change this behavior, override the exit callback using [`exiter`](#commandexiterexit).

##### Overloads

- `exit(e: CommandError | KronkError): never`
- `exit(e?: null | undefined): undefined`

##### Parameters

- `e` ([`CommandError`](#commanderrorinfo-1) | [`KronkError`](#kronkerrorinfo) | `null` | `undefined`)
  — the error to handle

##### Returns

(`never` | `undefined`) Nothing

##### Throws

([`KronkError`](#kronkerrorinfo)) If `e` is an unhandled error after calling the command exit callback

#### `Command#exiter([exit])`

Get or set the exit callback.

##### Overloads

- `exiter(exit: Exit | null | undefined): this`
- `exiter(): Exit`

##### Parameters

- `exit` ([`Exit`](#exit) | `null` | `undefined`)
  — the callback to fire on process exit

##### Returns

([`Exit`](#exit) | [`this`](#commandinfo)) Command exit callback or `this` command

#### `Command#findCommand(ref)`

Find a command with a name or alias matching `ref`.

##### Parameters

- `ref` ([`CommandName`](#commandname) | [`List<CommandName>`](#list) | `undefined`)
  — a command name, command alias, or list of such references

##### Returns

([`Command`](#commandinfo) | [`this`](#commandinfo) | `undefined`) Command with a name or alias matching `ref`

#### `Command#findOption(flag[, direction])`

Find an option with a flag matching `flag`.

Options known to [`this`](#commandinfo) command and its ([`defaultCommand`](#commanddefaultcommand)) are searched by
default. Set `direction` to `0` to only search for options known to the current command.

##### Parameters

- `flag` (`string` | `null` | `undefined`)
  — the option flag to match
- `direction` (`0` | `null` | `undefined`, optional)
  — the direction to search for options

##### Returns

([`Option`](#optioninfo) | `undefined`) Option with the long or short flag `flag`

#### `Command#help([help])`

Get the help text utility, configure the help text, or print the help text.

##### Overloads

- `help(help: Help | HelpTextOptions | null | undefined): this`
- `help(help: true): undefined`
- `help<T extends Help>(): T`

##### Type Parameters

- `T` ([`Help`](#helpoptions))
  — help text utility instance

##### Parameters

- `help` ([`Help`](#helpoptions) | [`HelpTextOptions`](#helptextoptions) | `true` | `null`| `undefined`)
  — the help text utility, options for formatting help text, or `true` to print the help text

##### Returns

(`T` | [`this`](#commandinfo) | `undefined`) Help text utility, `this` command, or nothing

#### `Command#helpCommand([help])`

Get or configure the help subcommand.

> 👉 **Note**: No cleanup is performed when this method is called
> with a different name (i.e. `help` as a string or `help.name`).

##### Overloads

- `helpCommand(help: HelpCommandData | null | undefined): this`
- `helpCommand<T extends Command>(): T | null`

##### Type Parameters

- `T` ([`Command`](#commandinfo))
  — the help subcommand instance

##### Parameters

- `help` ([`HelpCommandData`](#helpcommanddata) | `null`| `undefined`)
  — subcommand instance, subcommand info, `false` to disable the help subcommand,
  or any other allowed value to use the default configuration

##### Returns

(`T` | [`this`](#commandinfo) | `null`) Help subcommand or `this` command

#### `Command#helpOption([help])`

Get or configure the help option.

> 👉 **Note**: No cleanup is performed when this method is called
> with different flags (i.e. `help` as a string or `help.flags`).

##### Overloads

- `helpOption(help: HelpOptionData | null | undefined): this`
- `helpOption<T extends Option>(): T | null`

##### Type Parameters

- `T` ([`Option`](#optioninfo))
  — the help option instance

##### Parameters

- `help` ([`HelpOptionData`](#helpoptiondata) | `null`| `undefined`)
  — option flags, option instance, option info, `false` to disable the help option,
  or any other allowed value to use the default configuration

##### Returns

(`T` | [`this`](#commandinfo) | `null`) Help option or `this` command

#### `Command#hook(hook[, fn])`

Manage a `hook` or get a list of callbacks for the hooks.

##### Overloads

- `hook<H extends KronkHookName>(hook: H, fn: HooksData[H] | false): this`
- `hook<H extends KronkHookName>(hook: H): HooksInfo[H]`

##### Type Parameters

- `H` ([`KronkHookName`](#kronkhookname))
  — the hook name

##### Parameters

- `hook` (`H`)
  — the hook name
- `fn` (`H`)
  — the callback or callbacks to add, with falsy values used to remove all callbacks

##### Returns

([`HooksInfo[H]`](#hooksinfo) | [`this`](#commandinfo)) The list of hook callbacks or `this` command

#### `Command#hooks([hooks])`

Manage hooks or get the hooks record.

##### Overloads

- `hooks(hooks: HooksData | false | null | undefined): this`
- `hooks(): HooksInfo`

##### Parameters

- `hooks` ([`HooksData`](#hooksdata) | `false` | `null` | `undefined`)
  — the hooks configuration, with falsy values used to remove hooks

##### Returns

([`HooksInfo`](#hooksinfo) | [`this`](#commandinfo)) The hooks record or `this` command

#### `Command#id([name])`

Get or set the name of the command.

##### Overloads

- `id(name: CommandName | undefined): this`
- `id(): CommandName`

##### Parameters

- `name` ([`CommandName`](#commandname) | `undefined`)
  — the name of the command

##### Returns

([`CommandName`](#commandname) | [`this`](#commandinfo)) The name of `this` command or `this` command

#### `Command#on<T>(event, listener[, options])`

Register an `event` listener.

##### Type Parameters

- `T` ([`KronkEvent`](#kronkeventid))
  — the event being listened for

##### Parameters

- `event` ([`T['id']`](#kronkeventid-1))
  — the name of the event being listened for
- `listener` ([`KronkEventListener<T>`](#kronkeventlistenert))
  — the event listener
- `options` ([`OnOptions`][onoptions], optional)
  — event listening options

##### Returns

(`undefined`) Nothing

#### `Command#option(info[, data])`

Define an option for the command.

##### Overloads

- `option(info: Flags | OptionInfo): this`
- `option(info: Flags, data?: OptionData | null | undefined): this`

##### Parameters

- `info` ([`Flags`](#flags) | [`OptionInfo`](#optioninfo-1))
  — option flags or info
- `data` ([`OptionData`](#optiondata), optional)
  — additional argument info

##### Returns

([`this`](#commandinfo)) `this` command

#### `Command#optionPriority([priority])`

Get or set the strategy to use when merging global and local options.

##### Overloads

- `optionPriority(priority: OptionPriority | null | undefined): this`
- `optionPriority(): OptionPriority`

##### Parameters

- `priority` ([`OptionPriority`](#optionpriority) | `null`| `undefined`)
  — the strategy to use when merging options

##### Returns

([`OptionPriority`](#optionpriority) | [`this`](#commandinfo)) Option merge strategy or `this` command

#### `Command#optionValue(key[, value][, source])`

Get or set an option value.

##### Overloads

- `optionValue(key: Option['key'], value: unknown, source?: OptionValueSource | null | undefined): this`
- `optionValue<T>(key: Option['key']): T`

##### Type Parameters

- `T` (`any`)
  — the parsed option value

##### Parameters

- `key` ([`Option['key']`](#optionkey))
  — the option key
- `value` (`unknown`)
  — the parsed option value
- `source` ([`OptionValueSource`](#optionvaluesource-1) | `null` | `undefined`)
  — the source of the option value

##### Returns

(`T` | [`this`](#commandinfo)) The stored option value or `this` command

#### `Command#optionValueSource(key[, source])`

Get or set an option value source.

##### Overloads

- `optionValueSource(key: Option['key'], source: OptionValueSource | null | undefined): this`
- `optionValueSource(key: Option['key']): OptionValueSource | undefined`

##### Parameters

- `key` ([`Option['key']`](#optionkey))
  — the option key
- `source` ([`OptionValueSource`](#optionvaluesource-1) | `null` | `undefined`, optional)
  — the source of the option value

##### Returns

([`OptionValueSource`](#optionvaluesource-1) | [`this`](#commandinfo) | `undefined`)
The option value source or `this` command

#### `Command#options([infos])`

Batch define options for the command or get an options map.

Each key is a long or short flag and each value is an option.

##### Overloads

- `options(infos: List<Flags | OptionInfo>): this`
- `options(): Map<string, Option>`

##### Parameters

- `infos` ([`List<Flags | OptionInfo>`](#list))
  — list of option [flags](#flags) and/or [info](#optioninfo-1)

##### Returns

([`Map<string, Option>`](#optioninfo) | [`this`](#commandinfo)) The options map or `this` command

#### `Command#opts<T>()`

Get a record of local option values.

##### Type Parameters

- `T` ([`OptionValues`](#optionvaluest))
  — local option values type

##### Returns

(`T`) Local option values

#### `Command#optsWithGlobals<T>()`

Get a record of global and local option values.

> 👉 **Note**: Local options overwrite global options by default.
> Prioritize global options (i.e. `cmd.optionPriority('global')`) to change this behavior.

##### Type Parameters

- `T` ([`OptionValues`](#optionvaluest))
  — merged option values type

##### Returns

(`T`) Merged option values

#### `Command#parse<T>([argv][, options])`

Parse `argv`, setting options and invoking commands when defined.

The default expectation is that the arguments are from node and have the application as `argv[0]` and the script being
run in `argv[1]`, with user parameters after that.

> 👉 **Note**: If any parsers or [`action`](#commandactionaction) handlers are async, the parse needs to be awaited.

##### Type Parameters

- `T` ([`Awaitable<Command>`](#awaitablet) | [`this`](#commandinfo))
  — the running command

##### Parameters

- `argv` ([`List<string>`](#list) | `null` | `undefined`, optional)
  — the command-line arguments
- `options` ([`ParseOptions`](#parseoptions) | `null` | `undefined`, optional)
  — options for parsing `argv`

##### Returns

(`T`) The running command

#### `Command#process`

[`Process`](#process)

Information about the current process.

#### `Command#restore<T>()`

Restore the state of the command and its ancestors.

Resets parsed values, and calls any [`restore`](#restoreparser) functions defined on argument and option parsers.
Arguments, options, and subcommands will **not** be reset.

A promise is returned if any `restore` functions are async.

##### Type Parameters

- `T` ([`Awaitable<this>`](#awaitablet))
  — the current command

##### Returns

(`T`) [`this`](#commandinfo) command

#### `Command#snapshot()`

Get a snapshot of `this` command.

##### Returns

([`CommandSnapshot`](#commandsnapshot-1)) Command snapshot object

#### `Command#summary([summary])`

Get or set the command summary.

##### Overloads

- `summary(summary: string | null | undefined): this`
- `summary(): string | null`

##### Parameters

- `summary` (`string` | `null`| `undefined`)
  — the command summary

##### Returns

(`string` | [`this`](#commandinfo) | `null`) Summary of `this` command or `this` command

#### `Command#toString()`

Get the command as a human-readable string.

##### Returns

(`string`) String representation of `this` argument

#### `Command#unknown`

[`UnknownStrategy`](#unknownstrategy)

The strategy for handling unknown command-line arguments.

#### `Command#unknowns([strategy])`

Get or set the strategy for handling unknown command-line arguments.

##### Overloads

- `unknowns(strategy: UnknownStrategy | null | undefined): this`
- `unknowns(): UnknownStrategy`

##### Parameters

- `strategy` ([`UnknownStrategy`](#unknownstrategy) | `null`| `undefined`)
  — the strategy for handling unknown command-line arguments

##### Returns

([`UnknownStrategy`](#unknownstrategy) | [`this`](#commandinfo))
Unknown command-line argument strategy or `this` command

#### `Command#uniqueCommands<T>()`

Get a list of unique subcommands.

##### Type Parameters

- `T` ([`Command`](#commandinfo))
  — the command instance

##### Returns

([`Set<T>`](#commandinfo)) The list of subcommands

#### `Command#uniqueOptions<T>()`

Get a list of unique options.

##### Type Parameters

- `T` ([`Option`](#optioninfo))
  — the option instance

##### Returns

([`Set<T>`](#optioninfo)) The list of options

#### `Command#usage([usage])`

Get or set the command usage description.

##### Overloads

- `usage(usage: UsageData | null | undefined): this`
- `usage(): UsageInfo`

##### Parameters

- `usage` ([`UsageData`](#usagedata) | `null`| `undefined`)
  — command usage data

##### Returns

([`UsageInfo`](#usageinfo) | [`this`](#commandinfo)) Command usage info or `this` command

#### `Command#userOptions<T>([filter])`

Get a list of options passed by the user.

User options are have a value that is not `undefined` and a source that is not `default`.

##### Type Parameters

- `T` ([`Option`](#optioninfo))
  — the option instance

##### Parameters

- `filter` ([`OptionValueSource`](#optionvaluesource-1) | `null`| `undefined`, optional)
  — an additional option value source filter

##### Returns

([`Set<T>`](#optioninfo)) The list of user options

#### `Command#version([version])`

Get, set, or print the command version.

##### Overloads

- `version(version: Version | null | undefined): this`
- `version(version: true): undefined`
- `version<T extends Version>(): T | null`

##### Type Parameters

- `T` ([`Version`](#version))
  — the command version

##### Parameters

- `version` ([`Version`](#version) | `true` | `null`| `undefined`)
  — the command version or `true` to print the command version

##### Returns

(`T` | [`this`](#commandinfo) | `null`) The command version or `this` command

#### `Command#versionOption([version])`

Get or configure the version option.

> 👉 **Note**: No cleanup is performed when this method is called
> with different flags (i.e. `version` as a string or `version.flags`).

##### Overloads

- `versionOption(version: VersionOptionData | null | undefined): this`
- `versionOption<T extends Option>(): T | null`

##### Type Parameters

- `T` ([`Option`](#optioninfo))
  — the version option instance

##### Parameters

- `version` ([`VersionOptionData`](#versionoptiondata) | `null`| `undefined`)
  — option flags, option instance, option info, `false` to disable the version option,
  or any other allowed value to use the default configuration

##### Returns

(`T` | [`this`](#commandinfo) | `null`) Version option or `this` command

### `CommandEvent<T>(command)`

A parsed command event (`class`).

#### Extends

- [`KronkEvent`](#kronkeventid)

#### Signatures

- `constructor(option: T, value: RawOptionValue, source: OptionValueSource, flag?: Flags | null | undefined)`
- `constructor(option: T, value: unknown, source: optionValueSource.implied, flag?: Flags | null | undefined)`

##### Type Parameters

- `T` ([`Command`](#commandinfo), optional)
  — The command instance

##### Parameters

- `command` (`T`)
  — the command instance representing the parsed command

#### `CommandEvent#command`

[`Command`](#commandinfo)

The [command](#commandinfo) instance representing the parsed command.

#### `CommandEvent#id`

[`Command['event']`](#commandevent)

The command event name.

### `CommandError(info)`

A command error (`class`).

#### Extends

- [`KronkError`](#kronkerrorinfo)

#### Parameters

- `info` ([`CommandErrorInfo`](#commanderrorinfo-2))
  — info about the error

#### `CommandError#command`

[`Command`](#commandinfo) | `null`

The command where the error originated.

#### `CommandError#snapshot()`

Get a snapshot of the error.

##### Returns

([`CommandErrorSnapshot`](#commanderrorsnapshot-1)) Error snapshot object

### `Help([options])`

Help text utility (`class`).

#### Parameters

- `options` ([`HelpTextOptions`](#helptextoptions) | `null` | `undefined`)
  — options for formating help text

#### `Help#prepare([options])`

Prepare the help text context.

##### Parameters

- `options` ([`HelpTextOptions`](#helptextoptions) | `null` | `undefined`)
  — options for formating help text

##### Returns

([`this`](#helpoptions)) `this` help text utility

#### `Help#text(cmd)`

Generate help text for a command.

##### Parameters

- `cmd` ([`Command`](#commandinfo))
  — the command to generate help text for

##### Returns

(`string`) Formatted help text

### `Helpable([info])`

A help text candidate (`abstract class`).

#### Parameters

- `info` ([`HelpableInfo`](#helpableinfo-1))
  — candidate info

#### `Helpable#ancestors()`

Get a list of ancestor commands.

The first command is the parent of `this` command, and the last is the greatest grandparent of `this` command.

##### Returns

([`Command[]`](#commandinfo)) The list of ancestor commands

#### `Helpable#description([description])`

Get or set the candidate description.

The description can be long or short form text, or a URL pointing to more information about the candidate.

##### Overloads

- `description(description: URL | string | null | undefined): this`
- `description(): string`

##### Parameters

- `description` (`URL` | `string`)
  — candidate description text or a URL pointing to more info

##### Returns

(`string` | [`this`](#helpableinfo)) Candidate description or `this` candidate

#### `Helpable#hidden`

`boolean`

Whether the candidate should **not** be displayed in help text.

#### `Helpable#hide([hidden])`

Remove the candidate from the help text.

##### Parameters

- `hidden` (`boolean` | `null` | `undefined`)
  — whether the candidate should be hidden in help text
  - default: `true`

##### Returns

([`this`](#helpableinfo)) `this` candidate

#### `Helpable#parent`

[`Command`](#commandinfo) | `null` | `undefined`

The parent command.

### `KronkError(info)`

A command-line error (`class`).

#### Extends

- `Error`

#### Signatures

- `constructor(info: KronkErrorInfo | string)`
- `constructor(info: string, id?: EmptyString | KronkErrorId | null | undefined, code?: ExitCode | null | undefined)`

#### Parameters

- `info` ([`KronkErrorInfo`](#kronkerrorinfo-1) | `string`)
  — error info or human-readable description of the error
- `id` ([`EmptyString`](#emptystring) | [`KronkErrorId`](#kronkerrorid-1))
  — unique id representing the error
- `code` ([`ExitCode`](#exitcode))
  — suggested exit code to use with `process.exit`

#### `KronkError#additional`

`string[]`

Additional lines to be logged with the error.

#### `KronkError#cause`

[`KronkErrorCause`](#kronkerrorcause-1) | `null` | `undefined`

Info about the cause of the error.

#### `KronkError#code`

`number`

The suggested exit code to use with `process.exit`.

#### `KronkError#id`

[`KronkErrorId`](#kronkerrorid-1)

Unique id representing the error.

#### `KronkError#toJSON()`

Get the error as a JSON object.

##### Returns

([`KronkErrorJson`](#kronkerrorjson)) JSON representation of `this` error

#### `KronkError#toString()`

Get the error as a human-readable string.

##### Returns

(`string`) String representation of `this` error

### `KronkEvent(id)`

An event (`class`).

#### Parameters

- `id` ([`KronkEventName`](#kronkeventname))
  — the unique id representing the event

#### `KronkEvent#id`

[`KronkEventName`](#kronkeventname)

The unique id representing the event.

#### `KronkEvent#toString()`

Get the event as a human-readable string.

##### Returns

(`string`) String representation of `this` event

### `Option(info)`

A command option (`class`).

#### Extends

- [`Parseable`](#parseableinfo)

#### Signatures

- `constructor(info: Flags | OptionInfo)`
- `constructor(info: Flags, data?: OptionData | null | undefined)`

#### Parameters

- `info` ([`Flags`](#flags) | [`OptionInfo`](#optioninfo-1))
  — option flags or info
- `data` ([`OptionData`](#optiondata))
  — additional option info

#### `Option#boolean`

`boolean`

Whether the option is a boolean option.
Boolean options are options that do not take any option-arguments.

#### `Option#conflicts([conflicts])`

Get or set option names that conflict with the option.

##### Overloads

- `conflicts(conflicts: List<string> | string | null | undefined): this`
- `conflicts(): Set<string>`

##### Parameters

- `conflicts` ([`List<string>`](#list) | `string` | `null` | `undefined`)
  — an option name, or list of option names, that conflict with the option

##### Returns

(`Set<string>` | [`this`](#optioninfo)) List of conflicting option names or `this` option

#### `Option#depends([depends])`

Get or set required options.

##### Overloads

- `depends(depends: List<string> | string | null | undefined): this`
- `depends(): Set<string>`

##### Parameters

- `depends` ([`List<string>`](#list) | `string` | `null` | `undefined`)
  — an option reference, or list of option references, that the option depends on

##### Returns

(`Set<string>` | [`this`](#optioninfo)) The list of dependent options or `this` option

#### `Option#env([env])`

Get or set the environment variables to check for the value of the option.

##### Overloads

- `env(env: List<string> | string | null | undefined): this`
- `env(): Set<string>`

##### Parameters

- `env` ([`List<string>`](#list) | `string` | `null` | `undefined`)
  — the name of the environment variable to check, or a list of names, in order of priority, to check

##### Returns

(`string` | [`this`](#optioninfo)) Environment variable names or `this` option

#### `Option#event`

[`OptionEventName`](#optioneventname)

The event name for the option.

#### `Option#flags`

[`Flags`](#flags)

The normalized option flags string.

#### `Option#id`

`string`

The option id.

#### `Option#implies([implies])`

Get or set implied option values.

Implied option values are values that are set on other options
when `this` option is passed, but the implied option is not.

Lone keys (string `implies`) imply `true`, i.e. `{ [implies]: true }`.

The option-argument [`parser`](#parseableparserparser) will be called for implied values
that are strings and string arrays.

##### Overloads

- `implies(implies: OptionValues | string | null | undefined): this`
- `implies<T extends OptionValues>(): T`

##### Type Parameters

- `T` ([`OptionValues`](#optionvaluest))
  — implied option values

##### Parameters

- `implies` ([`OptionValues`](#optionvaluest) | `string` | `null` | `undefined`)
  — the key of an implied option, or a map where each key is an implied option key and each value is the value to use
  when the option is set but the implied option is not

##### Returns

(`T` | [`this`](#optioninfo)) Map of implied option values or `this` option

#### `Option#key`

`string`

The option [`id`](#optionid) in a format that can be used an object property key.

#### `Option#long`

`string` | `null`

The long flag for the option.
If `null`, the [`short`](#optionshort) flag will be a non-empty string.

#### `Option#mandate([mandatory])`

Specify if the option is mandatory.

Mandatory options must have a value after parsing, which usually means the option must be specified on the command line.

> 👉 **Note**: This method is a no-op if mandatory option syntax was used
> when defining option flags (i.e. `new Option('--token <!>')`).

##### Parameters

- `mandatory` (`boolean` | `null` | `undefined`, optional)
  — whether the option must have a value after parsing

##### Returns

([`this`](#optioninfo)) `this` option

#### `Option#mandatory`

`boolean`

Whether the option must have a value after parsing.

#### `Option#optional`

`boolean`

Whether a value is optional when the option is specified.

#### `Option#preset([preset])`

Get or set the preset to use when the option is specified without an argument.

The option-argument [`parser`](#parseableparserparser) will be called.

##### Overloads

- `preset(preset: string | null | undefined): this`
- `preset<T extends string>(): T | null`

##### Type Parameters

- `T` (`string`)
  — option-argument preset

##### Parameters

- `preset` (`string` | `null` | `undefined`)
  — the option-argument preset

##### Returns

(`T` | [`this`](#optioninfo) | `null`) The option-argument preset or `this` option

#### `Option#short`

`string` | `null`

The short flag for the option.
If `null`, the [`long`](#optionlong) flag will be a non-empty string.

#### `Option#toString()`

Get the option as a human-readable string.

##### Returns

(`string`) String representation of [`this`](#optioninfo) option

### `OptionEvent<T>(option, value, source[, flag])`

A parsed option event (`class`).

> 👉 **Note**: For options where the `source` is `'implied'`, the `value` may not be a raw option value.

#### Extends

- [`KronkEvent`](#kronkeventid)

#### Signatures

- `constructor(option: T, value: RawOptionValue, source: OptionValueSource, flag?: Flags | null | undefined)`
- `constructor(option: T, value: unknown, source: optionValueSource.implied, flag?: Flags | null | undefined)`

##### Type Parameters

- `T` ([`Option`](#optioninfo), optional)
  — The option instance

##### Parameters

- `option` (`T`)
  — the option instance representing the parsed option
- `value` ([`RawOptionValue`](#rawoptionvalue))
  — the `option` value
- `source` ([`OptionValueSource`](#optionvaluesource-1))
  — the source of the option `value`
- `flag` ([`Flags`](#flags), optional)
  — the parsed `option` flag

#### `OptionEvent#flag`

[`Flags`](#flags) | `null` | `undefined`

The parsed command [`option`](#optioninfo) flag.

#### `OptionEvent#id`

[`Option['event']`](#optionevent)

The option event name.

#### `OptionEvent#option`

`T`

The [option](#optioninfo) instance representing the parsed option.

#### `OptionEvent#source`

[`OptionValueSource`](#optionvaluesource-1)

The source of the option [`value`](#optioneventvalue).

#### `OptionEvent#value`

[`RawOptionValue`](#rawoptionvalue)

The raw [`option`](#optioninfo) value.

### `Parseable([info])`

A parse candidate (`abstract class`).

Parse candidates are the parseable components of commands (e.g. arguments and options).

#### Parameters

- `info` ([`ParseableInfo`](#parseableinfo-1))
  — candidate info

#### `Parseable#choices([choices])`

Get or set candidate choices.

##### Overloads

- `choices(choices: List<string> | null | undefined): this`
- `choices<T extends string>(): Set<T>`

##### Type Parameters

- `T` (`string`)
  — candidate choice

##### Parameters

- `choices` ([`List<string>`](#list) | `null` | `undefined`)
  — the list of allowed candidate choices

##### Returns

(`Set<T>` | [`this`](#parseableinfo)) The list of candidate choices or `this` candidate

#### `Parseable#default([info])`

Get or set the default value configuration.

##### Overloads

- `default(info: DefaultInfo | null | undefined): this`
- `default<T>(): DefaultInfo<T> | undefined`

##### Type Parameters

- `T` (`any`)
  — default value

##### Parameters

- `info` ([`DefaultInfo`](#defaultinfo))
  — the default value info

##### Returns

([`DefaultInfo<T>`](#defaultinfo) | [`this`](#parseableinfo) | `undefined`)
The default value info or `this` candidate

#### `Parseable#id`

`string`

The unique id for the candidate (`abstract`).

#### `Parseable#parser([parser])`

Get or set the handler used to parse candidate-arguments.

##### Overloads

- `parser(parser: ParseArg | null | undefined): this`
- `parser<T, Previous = T>(): ParseArg<T, Previous>`

##### Type Parameters

- `T` (`any`)
  — the result of the parse
- `Previous` (`any`, optional)
  — the previous parse result

##### Parameters

- `parser` ([`ParseArg`](#parseargt-previous) | `null` | `undefined`)
  — the argument parser

##### Returns

([`ParseArg<T, Previous>`](#parseargt-previous) | [`this`](#parseableinfo)) The argument parser or `this` candidate

#### `Parseable#required`

`boolean`

Whether the candidate is required.

Required arguments must have a value after parsing.
Required options must have a value supplied when the option is specified.

#### `Parseable#toString()`

Get the candidate as a human-readable string (`abstract`).

##### Returns

(`string`) String representation of [`this`](#parseableinfo) candidate

#### `Parseable#variadic`

`boolean`

Whether the candidate can be specified multiple times.

### `argumentValueSource`

Default argument value sources (`const enum`).

```ts
const enum argumentValueSource {
  cli = 'cli',
  default = 'default'
}
```

### `keid`

Default error ids (`const enum`).

```ts
const enum keid {
  argument_after_variadic = 'kronk/argument-after-variadic',
  conflicting_option = 'kronk/conflicting-option',
  duplicate_option = 'kronk/duplicate-option',
  duplicate_subcommand = 'kronk/duplicate-subcommand',
  error = 'kronk/error',
  excess_arguments = 'kronk/excess-arguments',
  invalid_argument = 'kronk/invalid-argument',
  invalid_argument_syntax = 'kronk/invalid-argument-syntax',
  invalid_flags = 'kronk/invalid-flags',
  invalid_subcommand_name = 'kronk/invalid-subcommand-name',
  missing_argument = 'kronk/missing-argument',
  missing_dependee_option = 'kronk/missing-dependee-option',
  missing_mandatory_option = 'kronk/missing-mandatory-option',
  no_flags = 'kronk/no-flags',
  required_argument_after_optional = 'kronk/required-argument-after-optional',
  unknown_option = 'kronk/unknown-option'
}
```

### `optionValueSource`

Default option value sources (`const enum`).

```ts
const enum optionValueSource {
  cli = 'cli',
  config = 'config',
  default = 'default',
  env = 'env',
  implied = 'implied'
}
```

## Types

This package is fully typed with [TypeScript][].

### `Action<[Opts][, Args]>`

The callback to fire when a command is ran (TypeScript type).

```ts
type Action<
  Opts extends OptionValues = OptionValues,
  Args extends any[] = any[]
> = (
  this: Command,
  opts: Opts,
  ...args: Args
) => Awaitable<null | undefined | void>
```

#### Type Parameters

- `Opts` ([`OptionValues`](#optionvaluest), optional)
  — command options
- `Args` (`any[]`, optional)
  — command arguments

#### Parameters

- **`this`** ([`Command`](#commandinfo))
  — the running command
- `options` (`Opts`)
  — the parsed command options
- `...args` (`Args`)
  — the parsed command arguments

#### Returns

([`Awaitable<null | undefined | void>`](#awaitablet)) Nothing

### `ArgumentData`

Data transfer object for command-arguments (TypeScript interface).

#### Extends

- [`ParseableInfo`](#parseableinfo-1)

### `ArgumentInfo`

Data used to create command-arguments (TypeScript interface).

#### Extends

- [`ArgumentData`](#argumentdata)

#### Properties

- `syntax` ([`ArgumentSyntax`](#argumentsyntax-1) | `string`)
  — argument syntax

### `ArgumentMetadata`

Command-argument metadata (TypeScript interface).

#### Extends

- [`ArgumentInfo`](#argumentinfo-1)
- [`ParseableMetadata`](#parseablemetadata)

#### Properties

- `id` (`string`)
  — argument syntax id
- `required` (`boolean`)
  — whether required syntax was used when defining the argument
- `variadic` (`boolean`)
  — whether variadic syntax was used when defining the argument

### `ArgumentSyntaxMap`

Registry of strings used to define command and option arguments (TypeScript interface).

```ts
interface ArgumentSyntaxMap {/* see code */}
```

When developing extensions that use additional syntaxes, augment `ArgumentSyntaxMap` to register custom syntaxes:

```ts
declare module '@flex-development/kronk' {
  interface ArgumentSyntaxMap {
    requiredMaybe: `<${string}?>`
  }
}
```

### `ArgumentSyntax`

Union of registered syntaxes used to define command and option arguments (TypeScript type).

To register custom syntaxes, augment [`ArgumentSyntaxMap`](#argumentsyntaxmap).
They will be added to this union automatically.

```ts
type ArgumentSyntax = ArgumentSyntaxMap[keyof ArgumentSyntaxMap]
```

### `ArgumentValueSourceMap`

Registry of command-argument value sources (TypeScript interface).

```ts
interface ArgumentValueSourceMap {/* see code */}
```

When developing extensions that use additional sources, augment `ArgumentValueSourceMap` to register custom sources:

```ts
declare module '@flex-development/kronk' {
  interface ArgumentValueSourceMap {
    builder: 'builder'
  }
}
```

### `ArgumentValueSource`

Union of registered command-argument value sources (TypeScript type).

To register custom sources, augment [`ArgumentValueSourceMap`](#argumentvaluesourcemap).
They will be added to this union automatically.

```ts
type ArgumentValueSource = ArgumentValueSourceMap[keyof ArgumentValueSourceMap]
```

### `ArgumentValueSources`

List, where each index is the position of a command-argument
and each value is the source of the argument value (TypeScript type).

```ts
type ArgumentValueSources = (ArgumentValueSource | undefined)[]
```

### `ArgumentsData`

Union of types used to create command arguments (TypeScript type).

```ts
type ArgumentsData =
  | ArgumentInfo
  | List<ArgumentInfo | ArgumentSyntax>
  | string
```

### `ArgvSourceMap`

Registry of command-line argument sources (TypeScript interface).

```ts
interface ArgvSourceMap {/* see code */}
```

When developing extensions that use additional sources, augment `ArgvSourceMap` to register custom sources:

```ts
declare module '@flex-development/kronk' {
  interface ArgvSourceMap {
    electron: 'electron'
  }
}
```

### `ArgvSource`

Union of registered command-line argument sources (TypeScript type).

To register custom sources, augment [`ArgvSourceMap`](#argvsourcemap).
They will be added to this union automatically.

```ts
type ArgvSource = ArgvSourceMap[keyof ArgvSourceMap]
```

### `Awaitable<[T]>`

Create a union of `T` and `T` as a promise-like object (TypeScript type).

```ts
type Awaitable<T = unknown> = PromiseLike<T> | T
```

#### Type Parameters

- `T` (`any`, optional)
  - the value

### `CommandData`

Data transfer object for commands (TypeScript interface).

#### Extends

- [`HelpableInfo`](#helpableinfo-1)

#### Properties

- `action?` ([`Action<any>`](#actionopts-args), optional)
  — the callback to fire when the command is ran
- `aliases?` ([`List<string>`](#list) | `string`, optional)
  — aliases for the command
- `arguments?` ([`List<string>`](#list), optional)
  — arguments for the command
- `default?` (`boolean`, optional)
  — whether this is the default command
- `exit?` ([`Exit`](#exit), optional)
  — callback to fire when the process is exited
- `help?` ([`Help`](#helpoptions) | [`HelpTextOptions`](#helptextoptions), optional)
  — options for formatting help text, or the utility to use when generating help text
  - default: `new Help()`
- `helpCommand?` ([`HelpCommandData`](#helpcommanddata), optional)
  — customize the help subcommand, or disable it (`false`)
  > 👉 **Note**: to configure the help command or option (i.e. `help help`, `help --help`) for `helpCommand`,
  > a [`Command`](#commandinfo) instance must be used.
  > both `helpCommand.helpCommand` and `helpCommand.helpOption` are set to `false` when `helpCommand` is not a `Command`
  - default: `{ description: 'show help', name: 'help' }`
- `helpOption?` ([`HelpOptionData`](#helpoptiondata), optional)
  — customize the help option, or disable it (`false`)
  - default: `{ description: 'show help', flags: '-h, --help' }`
- `hooks?` ([`HooksData`](#hooksdata), optional)
  — the hooks configuration
- `optionPriority?` ([`OptionPriority`](#optionpriority), optional)
  — the strategy to use when merging global and local options
  - default: `'local'`
- `options?` ([`OptionsData`](#optionsdata), optional)
  — options for the command
- `parent?` ([`Command`](#commandinfo), optional)
  — the parent command
- `subcommands?` ([`SubcommandsData`](#subcommandsdata), optional)
  — subcommands for the command
- `summary?` (`string`, optional)
  — a summary of the command
- `unknown?` ([`UnknownStrategy`](#unknownstrategy), optional)
  — the strategy to use for handling unknown command-line arguments
  - default: `false`
- `usage?` ([`UsageData`](#usagedata), optional)
  — an object describing how the command is used
  - default: `{ arguments: null, options: '[options]', subcommand: '[command]' }`
- `version?` ([`Version`](#version), optional)
  — the command version
- `versionOption?` ([`VersionOptionData`](#versionoptiondata), optional)
  — customize the version option
  - default: `{ description: 'print version number', flags: '-v, --version' }`

### `CommandErrorInfo`

Data used to create command errors (TypeScript interface).

#### Extends

- [`KronkErrorInfo`](#kronkerrorinfo-1)

#### Properties

- `command?` ([`Command`](#commandinfo), optional)
  — the command where the error originated
- `id` ([`KronkErrorId`](#kronkerrorid-1))
  — unique id representing the error

### `CommandErrorSnapshot`

Command error overview (TypeScript interface).

#### Extends

- [`KronkErrorJson`](#kronkerrorjson)

#### Properties

- `command` ([`CommandSnapshot`](#commandsnapshot) | `null`)
  — an overview of the failed command

### `CommandEventListener<[T]>`

Handle a parsed command `event` (TypeScript type).

```ts
type CommandEventListener<T extends Command = Command> = (
  event: CommandEvent<T>
) => undefined
```

#### Type Parameters

- `T` ([`Command`](#commandinfo), optional)
  — the parsed command

#### Parameters

- `event` ([`CommandEvent<T>`](#commandeventtcommand))
  — the emitted parsed command event

#### Returns

(`undefined`) Nothing

### `CommandEventNameMap`

Registry of command event names (TypeScript interface).

```ts
interface CommandEventNameMap {/* see code */}
```

When developing extensions that use additional events, augment `CommandEventNameMap` to register custom event names:

```ts
declare module '@flex-development/kronk' {
  interface CommandEventNameMap {
    custom: `command.${string}`
  }
}
```

### `CommandEventName`

Union of registered command event names (TypeScript type).

To register custom event names, augment [`CommandEventNameMap`](#commandeventnamemap).
They will be added to this union automatically.

```ts
type CommandEventName = CommandEventNameMap[keyof CommandEventNameMap]
```

### `CommandInfo`

Data used to create commands (TypeScript interface).

#### Extends

- [`CommandData`](#commanddata)

#### Properties

- `name?` ([`CommandName`](#commandname), optional)
  — the name of the command

### `CommandMetadata`

Command metadata (TypeScript interface).

#### Extends

- [`Omit<CommandInfo, 'arguments' | 'options' | 'subcommands'>`](#commandinfo-1)

#### Properties

- `action` ([`Action<any>`](#actionopts-args))
  — the callback to fire when the command is ran
- `aliases` (`Set<string>`)
  — list of command aliases
- `arguments` ([`Argument[]`](#argumentinfo))
  — list of command arguments
- `examples` ([`ExampleInfo[]`](#exampleinfo))
  — list of command examples
- `help` ([`Help`](#helpoptions))
  — the help text utility to use when generating help text
- `helpCommand` ([`Command`](#commandinfo) | `null` | `undefined`)
  — the help subcommand
- `helpOption` ([`Option`](#optioninfo) | `null` | `undefined`)
  — the help option
- `hooks` ([`HooksInfo`](#hooksinfo))
  — the hooks configuration
- `options` ([`Map<string, Option>`](#optioninfo))
  — map, where each key is a long or short flag and each value is the command option instance registered for that flag
- `parent?` (`null` | `undefined`)
  — the parent command
- `subcommands` ([`Map<string, Command>`](#commandinfo))
  — map, where each key is the name of a subcommand each value is a subcommand
- `versionOption` ([`Option`](#optioninfo) | `null` | `undefined`)
  — the version option

### `CommandName`

The name of a command (TypeScript type).

Parent commands do not need to have a name, but all subcommands must have a name.
Valid command names are non-empty strings.

```ts
type CommandName = string | null
```

### `CommandSnapshot`

Object representing a command overview (TypeScript interface).

#### Properties

- `ancestors` ([`CommandName[]`](#commandname))
  — list of ancestor command names
- `args` (`string[]`)
  — list of parsed command arguments
- `argumentValueSources` ([`ArgumentValueSources`](#argumentvaluesources))
  — list, where each index is the position of a command-argument and each value is the source of the argument value
- `argv` (`string[]`)
  — list of raw command arguments
- `name` ([`CommandName`](#commandname))
  — the name of the command
- `optionValueSources` ([`OptionValueSources`](#optionvaluesources))
  — record, where each key is an option key and each value is the source of the parsed option value
- `opts` ([`OptionValues`](#optionvaluest))
  — parsed command options
- `optsWithGlobals` ([`OptionValues`](#optionvaluest))
  — parsed command options (with globals)
- `usage` ([`UsageInfo`](#usageinfo))
  — the command usage info

### `DefaultInfo`

Data used to configure the default value of a command argument or option (TypeScript interface).

#### Type Parameters

- `T` (`any`, optional)
  — default value type

#### Properties

- `description?` (`URL` | `string`, optional)
  — a description of the default value
- `value?` (`T`, optional)
  — the default value

### `EmptyArray`

An empty array (TypeScript type).

```ts
type EmptyArray = []
```

### `EmptyObject`

An empty object (TypeScript type).

```ts
type EmptyObject = { [tag]?: never }
```

### `EmptyString`

An empty string (TypeScript type).

```ts
type EmptyString = ''
```

### `ExampleInfo`

Command example info (TypeScript interface).

#### Properties

- `command?` ([`CommandName`](#commandname) | `false`, optional)
  — the command name to use, with `false` used to omit the command name
- `comment?` (`string`, optional)
  — a comment to append to the example text
- `env?` (`string`, optional)
  — environment variable usage, to be prepended to the example text
- `text` (`string`)
  — the example text

### `ExamplesData`

Union of types used to configure command examples (TypeScript type).

```ts
type ExamplesData =
  | ExampleInfo
  | List<ExampleInfo | readonly string[] | string>
  | readonly string[]
  | string
```

### `ExitCode`

Union of exit status code types (TypeScript type).

```ts
type ExitCode = number | string
```

### `ExitProcess`

Terminate the process synchronously with an exit status of `code` (TypeScript type).

If `code` is omitted, `exit` uses either the 'success' code `0`
or the value of [`process.exitCode`](#process) if it has been set.

```ts
type ExitProcess = (code?: ExitCode | null | undefined) => undefined
```

#### Parameters

- `code?` ([`ExitCode`](#exitcode), optional)
  — exit status code

#### Returns

(`undefined`) Nothing

### `Exit`

The callback to fire when the process is exited (TypeScript type).

```ts
type Exit = (
  this: Command,
  e?: CommandError | KronkError | null | undefined
) => undefined
```

#### Parameters

- **`this`** ([`Command`](#commandinfo))
  — the current command or subcommand being executed
- `e?` ([`CommandError`](#commanderrorinfo) | [`KronkError`](#kronkerrorinfo), optional)
  — the error to handle (if any)

#### Returns

(`undefined`) Nothing

### `Flags`

A string comprised of option flags (TypeScript type).

The flags string can contain at most 2 flags, typically one long flag and one short or shortish (e.g. `--ws`) flag.
Flags are separated by commas (`,`), pipes (`|`), or spaces.

A short flag is a hyphen — specifically [HYPHEN-MINUS `U+002D`][hyphen] — followed by one case-insensitive alphanumeric
character.
The letters themselves have [conventional meanings][meanings] and are worth following, if possible.

A long flag starts with two hyphens followed by one or more case-insensitive alphanumeric characters. Using two hyphens
prevents long flags from being confused for grouped short options.
Hyphens and full stops ([FULL STOP `U+002E`][full-stop]) can be used to separate words, as well as camelCase format.

Option-arguments are marked as required using empty angle brackets (`<>`) or by wrapping an argument id in angle
brackets: `<id>`.
Optional arguments use empty square brackets (`[]`) or have their id wrapped in square brackets: `[id]`.

Variadic arguments are specified with an ellipsis wrapped in brackets (e.g. `<...>`, `[...]`) or by appending the
ellipsis to the end of the argument id (`<value...>`, `[value...]`). Option-arguments can also be marked as mandatory by
appending an exclamation mark to the end of the argument id: (`<!>`, `<id!>`, `<value!...>`).

```ts
type Flags = string
```

### `HelpCommandData`

Union of types used to configure the help subcommand (TypeScript type).

The help subcommand can be customized with
a [`Command`](#commandinfo) instance, [subcommand info object](#subcommandinfo), or a subcommand name.
It can also be disabled (`false`).

```ts
type HelpCommandData =
  | Command
  | CommandInfo
  | SubcommandInfo
  | boolean
  | string
```

### `HelpOptionData`

Union of types used to configure the command help option (TypeScript type).

The help option can be customized with an [`Option`](#optioninfo) instance, [flags](#flags),
or an [info object](#optioninfo-1). It can also be disabled (`false`).

```ts
type HelpOptionData = Flags | Option | OptionData | OptionInfo | boolean
```

### `HelpTextOptions`

Options for formating help text (TypeScript interface).

#### Extends

- [`ColorizerOptions`][colorizeroptions]

#### Properties

- `columns?` (`number`, optional)
  — the maximum number of columns to output
  - default: `110`
- `exampleMarker?` (`string` | `null` | `undefined`, optional)
  — the example marker to use
  - default: `'$'`
- `globalOptions?` (`boolean` | `null` | `undefined`, optional)
  — whether to show global options
  - default: `true`

### `HelpableInfo`

Data used to create help text candidates (TypeScript interface).

#### Properties

- `description?` (`URL | string`, optional)
  — a description of the candidate. the description can be long or short form text,
  or a URL pointing to more information about the candidate
- `hidden?` (`boolean`, optional)
  — whether the candidate should **not** be displayed in help text

### `KronkErrorCause`

Info about the cause of an error (TypeScript interface).

> 👉 **Note**: `Symbol.hasInstance` and `Symbol.unscopables` are used to identify arrays and functions.

```ts
interface KronkErrorCause {
  [Symbol.hasInstance]?: never
  [Symbol.unscopables]?: never
  [key: string]: any
}
```

### `Hook<[This][, Runner]>`

The callback to fire immediately before or after
the running command's [action](#actionopts-args) (TypeScript type).

```ts
type Hook<
  This extends Command = Command,
  Runner extends Command = Command
> = (
  this: This,
  command: Runner
) => Awaitable<null | undefined | void>
```

#### Type Parameters

- `This` ([`Command`](#commandinfo), optional)
  — the `this` context of the hook
- `Runner` ([`Command`](#commandinfo), optional)
  — the running command

#### Parameters

- **`this`** ([`Command`](#commandinfo))
  — the current command
- `command` (`Runner`)
  — the running command

#### Returns

([`Awaitable<null | undefined | void>`](#awaitablet)) Nothing

### `HooksData`

Data transfer object for hooks (TypeScript interface).

#### Properties

- `postAction?` ([`PostActionHook`](#postactionhook) | [`List<PostActionHook>`](#postactionhook), optional)
  — the callback, or callbacks, to fire immediately after the running command's [action](#commandactionaction)
- `preAction?` ([`PreActionHook`](#preactionhook) | [`List<PreActionHook>`](#preactionhook), optional)
  — the callback, or callbacks, to fire immediately before the running command's [action](#commandactionaction)
- `preCommand?` ([`PreCommandHook`](#precommandhook) | [`List<PreCommandHook>`](#precommandhook), optional)
  — the callback, or callbacks, to fire before a subcommand is ran

### `HooksInfo`

Command hooks info (TypeScript interface).

Each key is the name of a hook and each value is a hook function list.

#### Extends

- [`HooksData`](#hooksdata)

#### Properties

- `postAction` ([`PostActionHook[]`](#postactionhook))
  — the callbacks to fire immediately after the running command's [action](#commandactionaction)
- `preAction` ([`PreActionHook[]`](#preactionhook))
  — the callbacks to fire immediately before the running command's [action](#commandactionaction)
- `preCommand` ([`PreCommandHook[]`](#precommandhook))
  — the callbacks to fire before a subcommand is ran

### `KronkErrorId`

Union of registered error ids (TypeScript type).

To register custom error ids, augment [`KronkErrorMap`](#kronkerrormap).
They will be added to this union automatically.

```ts
type KronkErrorId = `kronk/${keyof KronkErrorMap}`
```

### `KronkErrorInfo`

Data used to create errors (TypeScript interface).

#### Properties

- `additional?` (`string | string[]`, optional)
  — additional lines to be logged with the error
- `cause?` ([`KronkErrorCause`](#kronkerrorcause-1), optional)
  — info about the cause of the error
- `code?` ([`ExitCode`](#exitcode), optional)
  — the suggested exit code to use with `process.exit`
  - default: `1`
- `id?` ([`EmptyString`](#emptystring) | [`KronkErrorId`](#kronkerrorid-1), optional)
  — the unique id representing the error
  - default: `'kronk/error'`
- `reason` (`string`)
  — a human-readable description of the error

### `KronkErrorJson`

JSON representation of an error (TypeScript interface).

#### Properties

- `additional` (`string[]`)
  — additional lines to be logged with the error
- `cause?` ([`KronkErrorCause`](#kronkerrorcause-1), optional)
  — info about the cause of the error
- `code` (`number`)
  — the suggested exit code to use with `process.exit`
- `id` ([`KronkErrorId`](#kronkerrorid-1))
  — the unique id representing the error
- `message` (`string`)
  — the human-readable description of the error
- `stack?` (`string`, optional)
  — stack trace

### `KronkErrorMap`

Registry of errors (TypeScript interface).

Each key is the **suffix** of an error id and each value is a [`KronkError`](#kronkerrorinfo).

```ts
interface KronkErrorMap {/* see code */}
```

When developing extensions that use additional errors, augment `KronkErrorMap` to register custom errors:

```ts
declare module '@flex-development/kronk' {
  interface KronkErrorMap {
    'action-error': CustomCommandError
    'parse-error': CustomKronkError
  }
}
```

### `KronkEventListener<[T]>`

Handle an `event` (TypeScript type).

```ts
type KronkEventListener<T extends KronkEvent = KronkEvent> = (
  event: T
) => Awaitable<undefined>
```

#### Type Parameters

- `T` ([`KronkEvent`](#kronkeventid), optional)
  — the emitted event

#### Parameters

- `event` (`T`)
  — the emitted event

#### Returns

(`undefined`) Nothing

### `KronkEventNameMap`

Registry of event names (TypeScript interface).

```ts
interface KronkEventNameMap extends OptionEventNameMap {/* see code */}
```

When developing extensions that use additional events, augment `KronkEventNameMap` to register custom event names:

```ts
declare module '@flex-development/kronk' {
  interface KronkEventNameMap {
    custom: 'kronk:custom'
  }
}
```

### `KronkEventName`

Union of registered event names (TypeScript type).

To register custom event names, augment [`KronkEventNameMap`](#kronkeventnamemap).
They will be added to this union automatically.

```ts
type KronkEventName = KronkEventNameMap[keyof KronkEventNameMap]
```

### `KronkHookMap`

Registry of hooks (TypeScript interface).

Each key is the name of a hook and each value is a hook function.

```ts
interface KronkHookMap {/* see code */}
```

When developing extensions that use additional hooks, augment `KronkHookMap` to register custom hooks:

```ts
declare module '@flex-development/kronk' {
  interface KronkErrorMap {
    custom: CustomHook
  }
}
```

### `KronkHookName`

Union of registered hook names (TypeScript type).

To register custom hook names, augment [`KronkHookMap`](#kronkhookmap).
They will be added to this union automatically.

```ts
type KronkHookName = Extract<keyof KronkHookMap, string>
```

### `KronkHook`

Union of registered hooks (TypeScript type).

To register custom hooks, augment [`KronkHookMap`](#kronkhookmap).
They will be added to this union automatically.

```ts
type KronkHook = KronkHookMap[keyof KronkHookMap]
```

### `List`

A list (TypeScript type).

#### Type Parameters

- `T` (`any`, optional)
  — list item type

```ts
type List<T = unknown> = ReadonlySet<T> | readonly T[]
```

### `Numeric`

A string that can be parsed to a valid number (TypeScript type).

```ts
type Numeric = `${number}`
```

### `OptionData`

Data transfer object for command options (TypeScript interface).

#### Extends

- [`ParseableInfo`](#parseableinfo-1)

#### Properties

- `conflicts?` ([`List<string>`](#list) | `string`, optional)
  — an option reference, or list of references, representing conflicting options.\
  an error will be displayed if conflicting options are found during parsing
  > 👉 **note**: local options can conflict with global options and other
  > local options, but global options cannot conflict with local options.
- `depends?` ([`List<string>`](#list) | `string`, optional)
  — an option reference, or list of references, representing required options.\
  an error will be displayed if any required options are missing.
  > 👉 **note**: local options can depend on global options and other
  > local options, but global options cannot depend on local options.
- `env?` ([`List<string>`](#list) | `string`, optional)
  — the name of the environment variable to check for the option value,
  or a list of names, in order of priority, to check
- `implies?` ([`OptionValues`](#optionvaluest) | `string`, optional)
  — a reference to an implied option, or a map where each key is a reference and each value is the value to use
  when the option is set but the implied option is not.\
  lone keys imply (string `implies`) `true`, i.e. `{ [implies]: true }`.\
  the option-argument [`parser`](#parseableparserparser) will be called for implied values that are strings
  > 👉 **note**: local options can imply global options and other
  > local options, but global options cannot imply local options.
- `mandatory?` (`boolean`, optional)
  — whether the option is mandatory. mandatory options must have a value after parsing, which usually means the option
  must be specified on the command line
  - default: `false`
- `preset?` (`string`, optional)
  — for boolean and optional options, the preset to use when the option is specified without an option-argument.
  > 👉 **note**: the option-argument `parser` will be called.
- `snakecase?` (`boolean`, optional)
  — whether to use `snake_case` format when converting the option id to an object property key

### `OptionEventListener<[T]>`

Handle a parsed option `event` (TypeScript type).

```ts
type OptionEventListener<T extends Option = Option> = (
  event: OptionEvent<T>
) => undefined
```

#### Type Parameters

- `T` ([`Option`](#optioninfo), optional)
  — the parsed option

#### Parameters

- `event` ([`OptionEvent<T>`](#optioneventtoption-value-source-flag))
  — the emitted parsed option event

#### Returns

(`undefined`) Nothing

### `OptionEventNameMap`

Registry of option event names (TypeScript interface).

```ts
interface OptionEventNameMap {/* see code */}
```

When developing extensions that use additional events, augment `OptionEventNameMap` to register custom event names:

```ts
declare module '@flex-development/kronk' {
  interface OptionEventNameMap {
    custom: `option.${string}`
  }
}
```

### `OptionEventName`

Union of registered option event names (TypeScript type).

To register custom event names, augment [`OptionEventNameMap`](#optioneventnamemap).
They will be added to this union automatically.

```ts
type OptionEventName = OptionEventNameMap[keyof OptionEventNameMap]
```

### `OptionInfo`

Data used to create command options (TypeScript interface).

#### Extends

- [`OptionData`](#optiondata)

#### Properties

- `flags` ([`Flags`](#flags))
  — option flags

### `OptionMetadata`

Command option metadata (TypeScript interface).

#### Extends

- [`OptionInfo`](#optioninfo-1)
- [`ParseableMetadata`](#parseablemetadata)

#### Properties

- `long` (`string` | `null` | `undefined`)
  — long flag
- `optional` (`boolean`)
  — whether a value is optional when the option is specified
- `required` (`boolean`)
  — whether a value must be supplied when the option is specified
- `short` (`string` | `null` | `undefined`)
  — short (or shortish, e.g. `--ws`) flag
  > 👉 **note**: if `null` or `undefined`, the `long` flag will be a non-empty string
- `variadic` (`boolean`)
  — whether the option can be specified multiple times

### `OptionPriority`

Union of strategies used when merging global and local options (TypeScript type).

- `global`: global options overwrite local options
- `local`: local options overwrite global options

```ts
type OptionPriority = 'global' | 'local'
```

### `OptionValueSourceMap`

Registry of option value sources (TypeScript interface).

```ts
interface OptionValueSourceMap {/* see code */}
```

When developing extensions that use additional sources, augment `OptionValueSourceMap` to register custom sources:

```ts
declare module '@flex-development/kronk' {
  interface OptionValueSourceMap {
    builder: 'builder'
  }
}
```

### `OptionValueSource`

Union of registered option value sources (TypeScript type).

To register custom sources, augment [`OptionValueSourceMap`](#optionvaluesourcemap).
They will be added to this union automatically.

```ts
type OptionValueSource = OptionValueSourceMap[keyof OptionValueSourceMap]
```

### `OptionValueSources`

Record, where each key is an option key ([`Option.key`](#optioninfo))
and each value is an [`OptionValueSource`](#optionvaluesource-1) (TypeScript type).

```ts
type OptionValueSources = { [x: Option['key']]: OptionValueSource }
```

### `OptionValues<[T]>`

Record, where each key is an option key ([`Option.key`](#optioninfo))
and each value is the parsed option value (TypeScript type).

#### Type Parameters

- `T` (`any`, optional)
  — the parsed option value

```ts
type OptionValues<T = any> = { [x: Option['key']]: T }
```

### `OptionsData`

Union of types used to create command options (TypeScript type).

```ts
type OptionsData =
  | Flags
  | List<Flags | OptionInfo>
  | OptionInfo
```

### `ParseArg<[T][, Previous]>`

Parse a raw argument `value` (TypeScript interface).

```ts
interface ParseArg<T = any, Previous = T> {
  (value: string, previous?: Previous): T
}
```

#### Type Parameters

- `T` (`any`, optional)
  — the result of the parse
- `Previous` (`any`, optional)
  — the previous parse result

#### Parameters

- `value` (`string`)
  — the raw argument to parse
- `previous` (`Previous`)
  — the default argument value, or the previous parse result for variadic arguments

#### Returns

(`T`) The parse result

#### Properties

- `restore?` ([`RestoreParser`](#restoreparser), optional)
  — restore the state of the parser

### `ParseOptions`

Options for parsing command-line arguments (TypeScript interface).

#### Properties

- `from?` ([`ArgvSource`](#argvsource), optional)
  — the source of the command line arguments

### `ParseUnknownResult`

The result of parsing unknown arguments (TypeScript interface).

#### Properties

- `operands` (`string[]`)
  — list of arguments that are operands (not options or values)
- `unknown` (`string[]`)
  — list containing the first unknown option and any remaining unknown arguments

### `ParseableInfo`

Data used to create parse candidates (TypeScript interface).

#### Extends

- [`HelpableInfo`](#helpableinfo-1)

#### Properties

- `choices?` ([`List<string>`](#list), optional)
  — the list of allowed choices
- `default?` ([`DefaultInfo`](#defaultinfo), optional)
  — the default value configuration
  > 👉 **note**: the argument `parser` is called **if the default value is a string**.
- `parser?` ([`ParseArg`](#parseargt-previous), optional)
  — the handler used to parse arguments. the handler receives two parameters, the raw, unparsed argument, and the
  previous value for the argument. it should return the new value for the argument

### `ParseableMetadata`

Parse candidate metadata (TypeScript interface).

#### Extends

- [`ParseableInfo`](#parseableinfo-1)

#### Properties

- `required?` (`boolean`, optional)
  — whether required syntax was used when defining the candidate
- `variadic?` (`boolean`, optional)
  — whether variadic syntax was used when defining the candidate.

### `PostActionHook`

Union of registered `postAction` hooks (TypeScript type).

To register custom hooks, augment [`KronkHookMap`](#kronkhookmap).
They will be added to this union automatically.

```ts
type PostActionHook = KronkHookMap['postAction']
```

### `PreActionHook`

Union of registered `preAction` hooks (TypeScript type).

To register custom hooks, augment [`KronkHookMap`](#kronkhookmap).
They will be added to this union automatically.

```ts
type PreActionHook = KronkHookMap['preAction']
```

### `PreCommandHook`

Union of registered `preCommand` hooks (TypeScript type).

To register custom hooks, augment [`KronkHookMap`](#kronkhookmap).
They will be added to this union automatically.

```ts
type PreCommandHook = KronkHookMap['preCommand']
```

### `ProcessEnv`

Information about the current user environment (TypeScript interface).

```ts
interface ProcessEnv {
  [key: string]: string | undefined
}
```

### `Process`

Information about the current process (TypeScript interface).

#### Properties

- `argv` (`string[]`)
  — list of command-line arguments passed when the process was launched
- `env` ([`ProcessEnv`](#processenv))
  — object containing information about the user environment
- `exit` ([`ExitProcess`](#exitprocess))
  — terminate the process synchronously with an exit status of `code`
- `exitCode?` ([`ExitCode`](#exitcode), optional)
  — the exit code to use when the process exits gracefully, or is exited via `exit` without specifying a code
- `stderr` ([`WriteStream`](#writestream))
  — the writeable stream for standard error output
- `stdout` ([`WriteStream`](#writestream))
  — the writeable stream for standard output

### `RawOptionValue`

Union of raw option value types (TypeScript type).

```ts
type RawOptionValue = boolean | string | null
```

### `RestoreParser`

Restore parser state (TypeScript type).

```ts
type RestoreParser = (this: void) => Awaitable<null | undefined | void>
```

#### Returns

([`Awaitable<null | undefined | void>`](#awaitablet)) Nothing

### `SubcommandInfo`

Data used to create subcommands (TypeScript interface).

#### Extends

- [`CommandInfo`](#commandinfo-1)

#### Properties

- `help?` (`null` | `undefined`)
  — options for formatting help text, or the utility to use when generating help text
- `name` (`string`)
  — the name of the subcommand

### `SubcommandsData`

Union of types used to create subcommands (TypeScript type).

```ts
type SubcommandsData = SubcommandInfo | SubcommandsInfo
```

### `SubcommandsInfo`

Record, where each key is the name of a subcommand and each value is an [info object](#commandinfo-1).

```ts
type SubcommandsInfo = { [subcommand: string]: CommandInfo }
```

### `UnknownStrategy`

Union of values used to alter handling of unknown command-line arguments (TypeScript type).

- `'arguments'`: allow unknown command-arguments only
- `'options'`: allow unknown options only
- `false`: disallow unknown command-arguments and options
- `true`: allow unknown command-arguments and options

```ts
type UnknownStrategy = 'arguments' | 'options' | boolean
```

### `UsageData`

An object describing command usage (TypeScript interface).

#### Properties

- `arguments?` (`readonly string[]` | `string`, optional)
  — the parts of the arguments descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible argument
  - default: generated using visible command arguments
- `options?` (`string` | `null`, optional)
  — the options descriptor, with `null` used to omit the descriptor completely
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible option
- `subcommand?` (`string`, optional)
  — the subcommands descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible subcommand
  - default: `'[command]'`

### `UsageInfo`

Command usage info (TypeScript interface).

#### Extends

- [`UsageData`](#usagedata)

#### Properties

- `arguments` (`readonly string[]`)
  — the parts of the arguments descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible argument
- `options` (`string` | `null`)
  — the options descriptor, with `null` used to omit the descriptor completely
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible option
- `subcommand` (`string`)
  — the descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible subcommand

### `VersionOptionData`

Union of types used to configure the command version option (TypeScript type).

The version option can be customized with an [`Option`](#optioninfo) instance, [flags](#flags),
or an [info object](#optioninfo-1). It can also be disabled (`false`).

```ts
type VersionOptionData = Flags | Option | OptionData | OptionInfo | boolean
```

### `Version`

Union of command version types (TypeScript type).

```ts
type Version = import('semver').SemVer | string
```

### `WriteStream`

The write stream API (TypeScript interface).

#### Properties

- `columns?` (`number`, optional)
  — the number of columns the tty currently has
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible argument
- `options` (`string` | `null`)
  — the options descriptor, with `null` used to omit the descriptor completely
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible option
- `write` ([`Write`](#write))
  — write data to the stream

### `Write`

Write data to the stream (TypeScript type).

```ts
type Write = (this: void, buffer: string) => boolean | undefined | void
```

#### Parameters

- `buffer` (`string`)
  — the data to write

#### Returns

(`boolean` | `undefined` | `void`) `true` if all data was flushed successfully, `false` if all or part of the data was
queued in user memory, or nothing

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.

[bun]: https://bun.sh

[colorizeroptions]: https://github.com/flex-development/colors#colorizeroptions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[full-stop]: https://www.fileformat.info/info/unicode/char/002e/index.htm

[hyphen]: https://www.fileformat.info/info/unicode/char/002d/index.htm

[meanings]: http://www.catb.org/~esr/writings/taoup/html/ch10s05.html

[nodejs]: https://nodejs.org

[onoptions]: https://github.com/EventEmitter2/EventEmitter2#emitteronevent-listener-options-objectboolean

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
