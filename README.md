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
- [Use](#use)
  - [Creating a *program*](#creating-a-program)
  - [Options](#options)
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
    - [`Command#ancestors()`](#commandancestors)
    - [`Command#args`](#commandargs)
    - [`Command#argument(info[, data])`](#commandargumentinfo-data)
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
    - [`Command#done([done])`](#commanddonedone)
    - [`Command#emit(event)`](#commandemitevent)
    - [`Command#emitOption(option, value, source[, flags])`](#commandemitoptionoption-value-source-flag)
    - [`Command#error(info)`](#commanderrorinfo)
    - [`Command#exit([e])`](#commandexite)
    - [`Command#exiter([exit])`](#commandexiterexit)
    - [`Command#findCommand(ref)`](#commandfindcommandref)
    - [`Command#findOption(flag[, direction])`](#commandfindoptionflag-direction)
    - [`Command#helpCommand([help])`](#commandhelpcommandhelp)
    - [`Command#helpOption([help])`](#commandhelpoptionhelp)
    - [`Command#id([name])`](#commandidname)
    - [`Command#logger`](#commandlogger)
    - [`Command#on<T>(event, listener[, options])`](#commandontevent-listener-options)
    - [`Command#option(info[, data])`](#commandoptioninfo-data)
    - [`Command#optionPriority([priority])`](#commandoptionprioritypriority)
    - [`Command#optionValue(key[, value][, source])`](#commandoptionvaluekey-value-source)
    - [`Command#optionValueSource(key[, source])`](#commandoptionvaluesourcekey-source)
    - [`Command#options([infos])`](#commandoptionsinfos)
    - [`Command#opts<T>()`](#commandoptst)
    - [`Command#optsWithGlobals<T>()`](#commandoptswithglobalst)
    - [`Command#parent`](#commandparent)
    - [`Command#parse([argv][, options])`](#commandparseargv-options)
    - [`Command#parseAsync([argv][, options])`](#commandparseasyncargv-options)
    - [`Command#process`](#commandprocess)
    - [`Command#snapshot()`](#commandsnapshot)
    - [`Command#summary([summary])`](#commandsummarysummary)
    - [`Command#toString()`](#commandtostring)
    - [`Command#unknown`](#commandunknown)
    - [`Command#unknowns([strategy])`](#commandunknownsstrategy)
    - [`Command#usage([usage])`](#commandusageusage)
    - [`Command#version([version])`](#commandversionversion)
  - [`CommandError(info)`](#commanderrorinfo-1)
    - [`CommandError#command`](#commanderrorcommand)
    - [`CommandError#snapshot()`](#commanderrorsnapshot)
  - [`Helpable([info])`](#helpableinfo)
    - [`Helpable#description([description])`](#helpabledescriptiondescription)
    - [`Helpable#hidden`](#helpablehidden)
    - [`Helpable#hide([hidden])`](#helpablehidehidden)
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
  - [`VersionOption(info)`](#versionoptioninfo)
    - [`VersionOption#version`](#versionoptionversion)
- [Types](#types)
  - [`Action`](#action)
  - [`ArgumentData`](#argumentdata)
  - [`ArgumentInfo`](#argumentinfo-1)
  - [`ArgumentMetadata`](#argumentmetadata)
  - [`ArgumentSyntaxMap`](#argumentsyntaxmap)
  - [`ArgumentSyntax`](#argumentsyntax-1)
  - [`ArgumentsData`](#argumentsdata)
  - [`ArgvSourceMap`](#argvsourcemap)
  - [`ArgvSource`](#argvsource)
  - [`Awaitable`](#awaitable)
  - [`CommandData`](#commanddata)
  - [`CommandErrorInfo`](#commanderrorinfo-2)
  - [`CommandErrorSnapshot`](#commanderrorsnapshot-1)
  - [`CommandInfo`](#commandinfo-1)
  - [`CommandMetadata`](#commandmetadata)
  - [`CommandName`](#commandname)
  - [`CommandSnapshot`](#commandsnapshot-1)
  - [`DefaultInfo`](#defaultinfo)
  - [`EmptyString`](#emptystring)
  - [`ExitCode`](#exitcode)
  - [`ExitProcess`](#exitprocess)
  - [`Exit`](#exit)
  - [`Flags`](#flags)
  - [`HelpCommandData`](#helpcommanddata)
  - [`HelpOptionData`](#helpoptiondata)
  - [`HelpableInfo`](#helpableinfo-1)
  - [`KronkErrorCause`](#kronkerrorcause-1)
  - [`KronkErrorId`](#kronkerrorid-1)
  - [`KronkErrorInfo`](#kronkerrorinfo-1)
  - [`KronkErrorJson`](#kronkerrorjson)
  - [`KronkErrorMap`](#kronkerrormap)
  - [`KronkEventListener`](#kronkeventlistener)
  - [`KronkEventNameMap`](#kronkeventnamemap)
  - [`List`](#list)
  - [`OptionData`](#optiondata)
  - [`OptionEventListener`](#optioneventlistener)
  - [`OptionEventNameMap`](#optioneventnamemap)
  - [`OptionEventName`](#optioneventname)
  - [`OptionInfo`](#optioninfo-1)
  - [`OptionMetadata`](#optionmetadata)
  - [`OptionPriority`](#optionpriority)
  - [`OptionValueSourceMap`](#optionvaluesourcemap)
  - [`OptionValueSource`](#optionvaluesource)
  - [`OptionValueSources`](#optionvaluesources)
  - [`OptionsData`](#optionsdata)
  - [`ParseArg`](#parsearg)
  - [`ParseOptions`](#parseoptions)
  - [`ParseableInfo`](#parseableinfo-1)
  - [`ParseableMetadata`](#parseablemetadata)
  - [`ProcessEnv`](#processenv)
  - [`Process`](#process)
  - [`RawOptionValue`](#rawoptionvalue)
  - [`SubcommandInfo`](#subcommandinfo)
  - [`SubcommandsData`](#subcommandsdata)
  - [`SubcommandsInfo`](#subcommandsinfo)
  - [`UnknownStrategy`](#unknownstrategy)
  - [`UsageData`](#usagedata)
  - [`UsageInfo`](#usageinfo)
  - [`VersionData`](#versiondata)
  - [`VersionOptionInfo`](#versionoptioninfo-1)
  - [`Version`](#version)
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

### Creating a *program*

kronk exports a global `program` object convenient for quick programs.
This is used in the examples throughout this `README` for brevity.

```js
import { program } from '@flex-development/kronk'
```

For larger programs using kronk in multiple ways, including unit testing, a `Command` should be created.

```ts
import { Command } from '@flex-development/kronk'
const program: Command = new Command()
```

### Options

Options are defined with the [`.option()`](#commandoptioninfo-data) and [`.options()`](#commandoptionsinfos) methods,
which also serve as documentation for the options. Each option can have at most 2 flags, typically one long flag and one
short or shortish (e.g. `-w`, `--ws`) flag. Flags can be separated by commas (`,`), pipes (`|`), or spaces (` `).

An option and its option-argument can be separated by an equal sign (`=`) or spaces (` `).
A short option (i.e. `-p`) and its option-argument can also be combined.

```sh
serve --port 80
serve --port=80
serve -p 80
serve -p80
serve -p=80
```

Options on the command line are not positional, and can be specified before or after command-arguments.

```sh
serve --port=80 ./server.mts
serve ./src/main.mts -p8080
```

If a non-option (i.e. `-13`) looks like an option because it starts with a hyphen (`-`), a delimiter (`--`) can be used
to demarcate the command-argument from an option.

```sh
clamp -M3 -m-1 -- -13
```

Parsed options can be accessed by calling [`.opts<T>()`](#commandoptst) on a [`Command`](#commandinfo) object, and are
passed to the command's [`action`](#commandactionaction) handler.
Multi-word options such as `--template-engine` are `camelCased`, becoming `program.opts().templateEngine`, or can be
configured to be converted using `snake_case`, becoming `program.opts().template_engine`.

There are additional, related routines for when `.opts<T>()` is not enough:

- [`.optionValue(key[, value][, source])`](#commandoptionvaluekey-value-source)
- [`.optionValueSource(key[, source])`](#commandoptionvaluesourcekey-source)
- [`.optsWithGlobals<T>()`](#commandoptswithglobalst)

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

- `constructor(info: CommandInfo | string)`
- `constructor(info: string, data?: CommandData | null | undefined)`

#### Parameters

- `info` ([`CommandInfo`](#commandinfo-1) | `string`)
  — command info or name
- `data` ([`CommandData`](#commanddata))
  — additional command info

#### `Command#action([action])`

Get or set the command action callback.

##### Overloads

- `action(action: Action<any> | null | undefined): this`
- `action<Opts extends OptionValues = OptionValues, Args extends any[] = any[]>(): Action<Opts, Args>`

##### Type Parameters

- `Opts` ([`OptionValues`](#optionvalues), optional)
  — parsed command options
- `Args` (`any[]`, optional)
  — parsed command arguments

##### Parameters

- `action` ([`Action<any>`](#action) | `null` | `undefined`)
  — the callback to fire when the command is ran

##### Returns

([`Action<Opts, Args>`](#action) | [`this`](#commandinfo)) The command action callback or `this` command

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
> that inherits settings from its [`parent`](#commandparent).

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

Get an alias for the command or add command aliases.

> 👉 **Note**: This method can be called more than once to add multiple aliases.

##### Overloads

- `alias(alias: List<string> | string): this`
- `alias(): CommandName`

##### Parameters

- `alias` ([`List<string>`](#list) | `string`)
  — an alias, or list of aliases, for the command

##### Returns

([`CommandName`](#commandname) | [`this`](#commandinfo)) Command alias or `this` command

#### `Command#aliases([aliases])`

Get or set aliases for the command.

##### Overloads

- `aliases(aliases: List<string> | string | null | undefined): this`
- `aliases(): Set<string>`

##### Parameters

- `aliases` ([`List<string>`](#list) | `string` | `null` | `undefined`)
  — an alias, or list of aliases, for the command

##### Returns

(`Set<string>` | [`this`](#commandinfo)) List of command aliases or `this` command

#### `Command#ancestors()`

Get a list of ancestor commands.

The first command is the parent of `this` command, and the last is the greatest grandparent of `this` command.

##### Returns

([`Command[]`](#commandinfo)) List of ancestor commands

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

Get a subcommand map or batch define subcommands for the command.

##### Overloads

- `commands(infos: SubcommandsInfo): this`
- `commands(): Map<string, Command>`

##### Parameters

- `infos` ([`SubcommandsInfo`](#subcommandsinfo))
  — subcommands info

##### Returns

([`Map<string, Command> | this`](#commandinfo)) Subcommand map or `this` command

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
- `createOption(info: VersionOptionInfo): VersionOption`
- `createOption(info: Flags, data?: OptionData | null | undefined): Option`

##### Parameters

- `info` ([`Flags`](#flags) | [`OptionInfo`](#optioninfo-1) | [`VersionOptionInfo`](#versionoptioninfo-1))
  — option info or flags
- `data` ([`OptionData`](#optiondata))
  — additional option info

##### Returns

([`Option`](#optioninfo) | [`VersionOption`](#versionoptioninfo)) New option instance

#### `Command#default`

`boolean`

Whether the command is the default subcommand of its [`parent`](#commandparent).

#### `Command#defaultCommand`

[`Command`](#commandinfo) | `null` | `undefined`

The default command.

#### `Command#done([done])`

Get or set the command done callback.

##### Overloads

- `done(done: Action<any> | null | undefined): this`
- `done<Opts extends OptionValues = OptionValues, Args extends any[] = any[]>(): Action<Opts, Args>`

##### Type Parameters

- `Opts` ([`OptionValues`](#optionvalues), optional)
  — parsed command options with globals
- `Args` (`any[]`, optional)
  — parsed command arguments

##### Parameters

- `done` ([`Action<any>`](#action) | `null` | `undefined`)
  — the callback to fire after the command is ran

##### Returns

([`Action<Opts, Args>`](#action) | [`this`](#commandinfo)) The command done callback or `this` command

#### `Command#emit(event)`

Emit an `event`.

##### Parameters

- `event` ([`KronkEvent`](#kronkeventid))
  — the event to emit

##### Returns

(`boolean`) `true` if event has listeners, `false` otherwise

#### `Command#emitOption(option, value, source[, flag])`

Emit a parsed `option` event.

##### Parameters

- `option` ([`Option`](#optioninfo))
  — the command option instance
- `value` ([`RawOptionValue`](#rawoptionvalue))
  — the raw `option` value
- `source` ([`OptionValueSource`](#optionvaluesource))
  — the source of the raw option `value`
- `flag?` ([`Flags`](#flags), optional)
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

#### `Command#helpCommand([help])`

Get or configure the help subcommand.

##### Overloads

- `helpCommand(help: HelpCommandData | null | undefined): this`
- `helpCommand<T extends Command = Command>(): T | null`

##### Type Parameters

- `T` ([`Command`](#commandinfo))
  — help subcommand instance

##### Parameters

- `help` ([`HelpCommandData`](#helpcommanddata) | `null`| `undefined`)
  — subcommand instance, subcommand info, `false` to disable the help subcommand,
  or any other allowed value to use the default configuration

##### Returns

(`T` | [`this`](#commandinfo) | `null`) Help subcommand or `this` command

#### `Command#helpOption([help])`

Get or configure the help option.

##### Overloads

- `helpOption(help: HelpOptionData | null | undefined): this`
- `helpOption<T extends Option = Option>(): T | null`

##### Type Parameters

- `T` ([`Option`](#optioninfo))
  — help option instance

##### Parameters

- `help` ([`HelpOptionData`](#helpoptiondata) | `null`| `undefined`)
  — option flags, option instance, option info, `false` to disable the help option,
  or any other allowed value to use the default configuration

##### Returns

(`T` | [`this`](#commandinfo) | `null`) Help option or `this` command

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

#### `Command#logger`

[`Logger`][logger]

Logger instance.

#### `Command#on<T>(event, listener[, options])`

Register an `event` listener.

##### Type Parameters

- `T` ([`KronkEvent`](#kronkeventid))
  — the event being listened for

##### Parameters

- `event` ([`T['id']`](#kronkeventid-1))
  — the name of the event being listened for
- `listener` ([`KronkEventListener<T>`](#kronkeventlistener))
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
  — parsed option value type

##### Parameters

- `key` ([`Option['key']`](#optionkey))
  — option key
- `value` (`unknown`)
  — the parsed option value to store
- `source` ([`OptionValueSource`](#optionvaluesource) | `null` | `undefined`)
  — the source of the original option value

##### Returns

(`T` | [`this`](#commandinfo)) Stored option value or `this` command

#### `Command#optionValueSource(key[, source])`

Get or set an option value source.

##### Overloads

- `optionValueSource(key: Option['key'], source: OptionValueSource | null | undefined): this`
- `optionValueSource(key: Option['key']): OptionValueSource | null | undefined`

##### Parameters

- `key` ([`Option['key']`](#optionkey))
  — option key
- `source` ([`OptionValueSource`](#optionvaluesource) | `null` | `undefined`, optional)
  — the source of the option value

##### Returns

([`OptionValueSource`](#optionvaluesource) | [`this`](#commandinfo) | `null` | `undefined`)
Option value source for `key` or `this` command

#### `Command#options([infos])`

Get a list of command options or batch define options for the command.

##### Overloads

- `options(infos: List<Flags | OptionInfo>): this`
- `options(): Option[]`

##### Parameters

- `infos` ([`List<Flags | OptionInfo>`](#list))
  — list of option [flags](#flags) and/or [info](#optioninfo-1)

##### Returns

([`Option[]`](#optioninfo) | [`this`](#commandinfo)) List of command options or `this` command

#### `Command#opts<T>()`

Get a record of local option values.

##### Type Parameters

- `T` ([`OptionValues`](#optionvalues))
  — local option values type

##### Returns

(`T`) Local option values

#### `Command#optsWithGlobals<T>()`

Get a record of global and local option values.

> 👉 **Note**: Local options overwrite global options by default.
> Prioritize global options (i.e. `cmd.optionPriority('global')`) to change this behavior.

##### Type Parameters

- `T` ([`OptionValues`](#optionvalues))
  — merged option values type

##### Returns

(`T`) Merged option values

#### `Command#parent`

[`Command`](#commandinfo) | `null` | `undefined`

The parent command.

#### `Command#parse([argv][, options])`

Parse `argv`, setting options and invoking commands when defined.

The default expectation is that the arguments are from node and have the application as `argv[0]` and the script being
run in `argv[1]`, with user parameters after that.

> 👉 **Note**: If the [`action`](#commandactionaction) handler is async,
> [`parseAsync`](#commandparseasyncargv-options) should be used instead.

##### Parameters

- `argv` ([`List<string>`](#list) | `null` | `undefined`, optional)
  — list of command-line arguments
- `options` ([`ParseOptions`](#parseoptions) | `null` | `undefined`, optional)
  — options for parsing `argv`

##### Returns

([`Command`](#commandinfo) | [`this`](#commandinfo)) The command that was run

#### `Command#parseAsync([argv][, options])`

Asynchronously parse `argv`, setting options and invoking commands when defined.

Otherwise the same as [`parse`](#commandparseargv-options).

> 👉 **Note**: If the [`action`](#commandactionaction) handler is async,
> this method should be used instead of [`parse`](#commandparseargv-options).

#### `Command#process`

[`Process`](#process)

Information about the current process.

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

#### `Command#version([version])`

Get or set the command version.

> 👉 **Note**: When setting the command version, this method auto-registers
> the version option with the flags `-v | --version`.
> No cleanup is performed when this method
> is called with different flags (i.e. `info` as a string or `info.flags`).

##### Overloads

- `version(version: VersionData | null | undefined): this`
- `version<T extends string = string>(): T | null`

##### Type Parameters

- `T` (`string`, optional)
  — command version type

##### Parameters

- `version` ([`VersionData`](#versiondata) | `null`| `undefined`)
  — command version, version option instance, or version option info

##### Returns

(`T` | [`this`](#commandinfo) | `null`) Command version or `this` command

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

### `Helpable([info])`

A help text candidate (`abstract class`).

#### Parameters

- `info` ([`HelpableInfo`](#helpableinfo-1))
  — candidate info

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

##### Overloads

- `implies(implies: OptionValues | string | null | undefined): this`
- `implies<T extends OptionValues>(): T`

##### Type Parameters

- `T` ([`OptionValues`](#optionvalues))
  — implied option values

##### Parameters

- `implies` ([`OptionValues`](#optionvalues) | `string` | `null` | `undefined`)
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

#### Extends

- [`KronkEvent`](#kronkeventid)

##### Type Parameters

- `T` ([`Option`](#optioninfo), optional)
  — Parsed command option

##### Parameters

- `option` (`T`)
  — the command option instance
- `value` ([`RawOptionValue`](#rawoptionvalue))
  — the raw `option` value
- `source` ([`OptionValueSource`](#optionvaluesource))
  — the source of the raw option `value`
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

The command [`option`](#optioninfo) instance.

#### `OptionEvent#source`

[`OptionValueSource`](#optionvaluesource)

The source of the raw option [`value`](#optioneventvalue).

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
  — list of allowed candidate choices

##### Returns

(`Set<T>` | [`this`](#parseableinfo)) List of candidate choices or `this` candidate

#### `Parseable#default([info])`

Get or set the default value configuration.

##### Overloads

- `default(info: DefaultInfo | null | undefined): this`
- `default<T>(): DefaultInfo<T> | null | undefined`

##### Type Parameters

- `T` (`any`)
  — default value

##### Parameters

- `info` ([`DefaultInfo`](#defaultinfo))
  — default value info

##### Returns

([`DefaultInfo<T>`](#defaultinfo) | [`this`](#parseableinfo) | `null` | `undefined`)
Default value info or `this` candidate

#### `Parseable#id`

`string`

The unique id for the candidate (`abstract`).

#### `Parseable#parser([parser])`

Get or set the handler used to parse candidate-arguments.

##### Overloads

- `parser(parser: ParseArg<any, any> | null | undefined): this`
- `parser<T, V extends string | string[] = string | string[]>(): ParseArg<T, V>`

##### Type Parameters

- `T` (`any`)
  — parse result
- `V` (`string | string[]`, optional)
  — the argument or arguments to parse

##### Parameters

- `parser` ([`ParseArg<any, any>`](#parsearg) | `null` | `undefined`)
  — the candidate-argument parser

##### Returns

([`ParseArg<T, V>`](#parsearg) | [`this`](#parseableinfo)) The candidate-argument parser or `this` candidate

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

### `VersionOption(info)`

A command version option (`class`).

#### Extends

- [`Option`](#optioninfo)

#### Parameters

- `info` ([`Version`](#version) | [`VersionOptionInfo`](#versionoptioninfo-1))
  — command version or option info

#### `VersionOption#version`

`string`

The version of the command.

## Types

This package is fully typed with [TypeScript][].

### `Action`

The callback to fire when a command is executed (TypeScript type).

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

- `Opts` ([`OptionValues`](#optionvalues), optional)
  — command options
- `Args` (`any[]`, optional)
  — command arguments

#### Parameters

- **`this`** ([`Command`](#commandinfo))
  — the command or subcommand being executed
- `options` (`Opts`)
  — parsed command options
- `...args` (`Args`)
  — parsed command arguments

#### Returns

([`Awaitable<null | undefined | void>`](#awaitable)) Nothing

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

### `Awaitable`

Create a union of `T` and `T` as a promise (TypeScript type).

#### Type Parameters

- `T` (`any`, optional)
  - the value

```ts
type Awaitable<T = unknown> = Promise<T> | T
```

### `CommandData`

Data transfer object for commands (TypeScript interface).

#### Extends

- [`HelpableInfo`](#helpableinfo-1)

#### Properties

- `action?` ([`Action<any>`](#action), optional)
  — callback to fire when the command is executed
- `aliases?` ([`List<string>`](#list) | `string`, optional)
  — aliases for the command
- `arguments?` ([`List<string>`](#list), optional)
  — arguments for the command
- `default?` (`boolean`, optional)
  — whether this is the default command
- `done?` ([`Action<any>`](#action), optional)
  — callback to fire after the command `action` is executed
- `exit?` ([`Exit`](#exit), optional)
  — callback to fire when the process is exited
- `helpCommand?` ([`HelpCommandData`](#helpcommanddata), optional)
  — customize the help subcommand, or disable it (`false`)
  > 👉 **Note**: to configure the help subcommand for `helpCommand`, a [`Command`](#commandinfo) instance must be used.
  > `helpCommand.helpCommand` is set to `false` when `helpCommand` is not a `Command`.
  - default: `{ description: 'show help', name: 'help' }`
- `helpOption?` ([`HelpOptionData`](#helpoptiondata), optional)
  — customize the help option, or disable it (`false`)
  - default: `{ description: 'show help', flags: '-h | --help' }`
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
- `version?` ([`VersionData`](#versiondata), optional)
  — command version configuration

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

- `arguments` ([`Argument[]`](#argumentinfo))
  — list of command arguments
- `helpOption` ([`Option`](#optioninfo) | `null` | `undefined`)
  — the help option
- `options` ([`Map<string, Option>`](#optioninfo))
  — map, where each key is a long or short flag and each value is the command option instance registered for that flag
- `parent?` (`null` | `undefined`)
  — the parent command
- `subcommands` ([`Map<string, Command>`](#commandinfo))
  — map, where each key is the name of a subcommand each value is a subcommand
- `version` ([`VersionOption`](#versionoptioninfo) | `null` | `undefined`)
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
- `argv` (`string[]`)
  — list of raw command arguments
- `name` ([`CommandName`](#commandname))
  — the name of the command
- `optionValueSources` ([`OptionValueSources`](#optionvaluesources))
  — record, where each key is an option key and each value is the source of the parsed option value
- `opts` ([`OptionValues`](#optionvalues))
  — parsed command options
- `optsWithGlobals` ([`OptionValues`](#optionvalues))
  — parsed command options (with globals)

### `DefaultInfo`

Data used to configure the default value of a command argument or option (TypeScript interface).

#### Type Parameters

- `T` (`any`, optional)
  — default value type

#### Properties

- `description?` (`URL | string`, optional)
  — description of the default value
- `value?` (`T`, optional)
  — the default value
  - default: `undefined`

### `EmptyString`

An empty string (TypeScript type).

```ts
type EmptyString = ''
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
type HelpCommandData = Command | SubcommandInfo | string | false
```

### `HelpOptionData`

Union of types used to configure the help option (TypeScript type).

The command help option can be customized with
an [`Option`](#optioninfo) instance, [flags](#flags), or an [info object](#optioninfo-1).
It can also be disabled (`false`).

```ts
type HelpOptionData = Flags | Option | OptionInfo | false
```

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

### `KronkEventListener`

Handle an `event` (TypeScript type).

```ts
type KronkEventListener<T extends KronkEvent = KronkEvent> = (
  event: T
) => undefined
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
    custom: 'command:custom'
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

### `List`

A list (TypeScript type).

#### Type Parameters

- `T` (`any`, optional)
  — list item type

```ts
type List<T = unknown> = ReadonlySet<T> | readonly T[]
```

### `OptionData`

Data transfer object for command options (TypeScript interface).

#### Extends

- [`ParseableInfo`](#parseableinfo-1)

#### Properties

- `conflicts?` ([`List<string>`](#list) | `string`, optional)
  — an option name, or list of option names, that conflict with the option.\
  an error will be displayed if conflicting options are found during parsing
- `env?` ([`List<string>`](#list) | `string`, optional)
  — the name of the environment variable to check for option value, or a list of names, in order of priority, to check
- `mandatory?` (`boolean`, optional)
  — whether the option is mandatory. mandatory options must have a value after parsing, which usually means the option
  must be specified on the command line
  - default: `false`
- `implies?` ([`OptionValues`](#optionvalues) | `string`, optional)
  — the key of an implied option, or a map where each key is an implied option key and each value is the value to use
  when the option is set but the implied option is not.\
  lone keys imply (string `implies`) `true`, i.e. `{ [implies]: true }`
- `preset?` (`string`, optional)
  — for boolean and optional options, the preset to use when the option is specified without an option-argument.
  > 👉 **note**: the option-argument `parser` will be called.
- `snakecase?` (`boolean`, optional)
  — whether to use `snake_case` format when converting the option id to an object property key

### `OptionEventListener`

Handle a parsed command option `event` (TypeScript type).

```ts
type OptionEventListener<T extends Option = Option> = (
  event: OptionEvent<T>
) => undefined
```

#### Type Parameters

- `T` ([`Option`](#optioninfo), optional)
  — the parsed command option

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
and each value is an [`OptionValueSource`](#optionvaluesource) (TypeScript type).

```ts
type OptionValueSources = {
  [x: Option['key']]: OptionValueSource | null | undefined
}
```

### `OptionValues`

Record, where each key is an option key ([`Option.key`](#optioninfo))
and each value is a parsed option value (TypeScript type).

#### Type Parameters

- `T` (`any`, optional)
  — parsed option value type

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

### `ParseArg`

Parse a command or option argument `value` (TypeScript type).

```ts
type ParseArg<T = any, Value extends string | string[] = string | string[]> = (
  this: void,
  value: Value,
  previous: T | undefined
) => T
```

#### Type Parameters

- `T` (`any`, optional)
  — parse result
- `Value` (`string | string[]`, optional)
  — the argument or arguments to parse

#### Parameters

- **`this`** ([`Command`](#commandinfo))
  — the current command or subcommand being executed
- `value` (`Value`)
  — the raw argument or arguments to parse
- `previous` (`T` | `undefined`)
  — the default argument value

#### Returns

(`T`) Parse result

### `ParseOptions`

Options for parsing command-line arguments (TypeScript interface).

#### Properties

- `from?` ([`ArgvSource`](#argvsource), optional)
  — the source of the command line arguments

### `ParseableInfo`

Data used to create parse candidates (TypeScript interface).

#### Extends

- [`HelpableInfo`](#helpableinfo-1)

#### Properties

- `choices?` ([`List<string>`](#list), optional)
  — list of option choices
- `default?` ([`DefaultInfo`](#defaultinfo), optional)
  — default value configuration
  > 👉 **note**: the option-argument `parser` will not be called.
- `parser?` ([`ParseArg<any, string> | ParseArg<any, string[]>`](#parsearg), optional)
  — handler used to parse arguments. the handler receives two parameters, the raw, unparsed argument (or
  *arguments* for variadic candidates), and the default value for the argument.
  it should return the new value for the argument

### `ParseableMetadata`

Parse candidate metadata (TypeScript interface).

#### Extends

- [`ParseableInfo`](#parseableinfo-1)

#### Properties

- `required?` (`boolean`, optional)
  — whether required syntax was used when defining the candidate
- `variadic?` (`boolean`, optional)
  — whether variadic syntax was used when defining the candidate.

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
- `stderr` ([`WriteStream`][writestream])
  — the writeable stream for standard error output
- `stdout` ([`WriteStream`][writestream])
  — the writeable stream for standard output

### `RawOptionValue`

Union of raw option value types (TypeScript type).

```ts
type RawOptionValue = boolean | string | string[] | null
```

### `SubcommandInfo`

Data used to create subcommands (TypeScript interface).

#### Extends

- [`CommandInfo`](#commandinfo-1)

#### Properties

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

- `arguments?` (`string`, optional)
  — command arguments descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible argument
  - default: generated using visible command arguments
- `options?` (`string`, optional)
  — command options descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible option
- `subcommand?` (`string`, optional)
  — subcommands descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible subcommand
  - default: `'[command]'`

### `UsageInfo`

Command usage info (TypeScript interface).

#### Extends

- [`UsageData`](#usagedata)

#### Properties

- `options` (`string`)
  — command options descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible option
- `subcommand` (`string`)
  — subcommands descriptor
  > 👉 **note**: displayed in auto-generated help text **only** when a command has at least one visible subcommand

### `VersionData`

Union of types used to configure the version of a [`Command`](#commandinfo) (TypeScript type).

```ts
type VersionData = Version | VersionOption | VersionOptionInfo
```

### `VersionOptionInfo`

Data used to create command version options (i.e. `-v | --version`) (TypeScript interface).

#### Extends

- [`OptionData`](#optiondata)

#### Properties

- `flags?` ([`Flags`](#flags), optional)
  — option flags
  - default: `'-v | --version'`
- `version` ([`Version`](#version))
  — the command version

### `Version`

Union of command version types (TypeScript type).

```ts
type Version = import('semver').SemVer | string
```

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.

[bun]: https://bun.sh

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[full-stop]: https://www.fileformat.info/info/unicode/char/002e/index.htm

[hyphen]: https://www.fileformat.info/info/unicode/char/002d/index.htm

[logger]: https://github.com/flex-development/log#logger-1

[meanings]: http://www.catb.org/~esr/writings/taoup/html/ch10s05.html

[nodejs]: https://nodejs.org

[onoptions]: https://github.com/EventEmitter2/EventEmitter2#emitteronevent-listener-options-objectboolean

[typescript]: https://www.typescriptlang.org

[writestream]: https://github.com/flex-development/log#writestream

[yarn]: https://yarnpkg.com
