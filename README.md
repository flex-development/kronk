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
- [API](#api)
  - [`Argument(info)`](#argumentinfo)
    - [`Argument#choices([choices])`](#argumentchoiceschoices)
    - [`Argument#default([info])`](#argumentdefaultinfo)
    - [`Argument#description([description])`](#argumentdescriptiondescription)
    - [`Argument#id`](#argumentid)
    - [`Argument#parser([parser])`](#argumentparserparser)
    - [`Argument#required`](#argumentrequired)
    - [`Argument#syntax`](#argumentsyntax)
    - [`Argument#toString()`](#argumenttostring)
    - [`Argument#variadic`](#argumentvariadic)
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
    - [`Command#description([description])`](#commanddescriptiondescription)
    - [`Command#done([done])`](#commanddonedone)
    - [`Command#emit(event)`](#commandemitevent)
    - [`Command#emitOption(option, value, source[, flags])`](#commandemitoptionoption-value-source-flags)
    - [`Command#error(info)`](#commanderrorinfo)
    - [`Command#exit([e])`](#commandexite)
    - [`Command#exiter([exit])`](#commandexiterexit)
    - [`Command#findCommand(x)`](#commandfindcommandx)
    - [`Command#findOption(flag[, direction])`](#commandfindoptionflag-direction)
    - [`Command#hidden`](#commandhidden)
    - [`Command#hide([hidden])`](#commandhidehidden)
    - [`Command#id([name])`](#commandidname)
    - [`Command#logger`](#commandlogger)
    - [`Command#on<T>(event, listener[, options])`](#commandontevent-listener-options)
    - [`Command#option(info[, data])`](#commandoptioninfo-data)
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
    - [`Command#unknowns(strategy)`](#commandunknownsstrategy)
    - [`Command#usage([usage])`](#commandusageusage)
    - [`Command#version([version])`](#commandversionversion)
  - [`CommandError(info)`](#commanderrorinfo-1)
    - [`CommandError#command`](#commanderrorcommand)
    - [`CommandError#snapshot()`](#commanderrorsnapshot)
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
    - [`Option#choices([choices])`](#optionchoiceschoices)
    - [`Option#default([info])`](#optiondefaultinfo)
    - [`Option#description([description])`](#optiondescriptiondescription)
    - [`Option#env([env])`](#optionenvenv)
    - [`Option#event`](#optionevent)
    - [`Option#flags`](#optionflags)
    - [`Option#hidden`](#optionhidden)
    - [`Option#hide([hidden])`](#optionhidehidden)
    - [`Option#id`](#optionid)
    - [`Option#key`](#optionkey)
    - [`Option#long`](#optionlong)
    - [`Option#mandatory`](#optionmandatory)
    - [`Option#optional`](#optionoptional)
    - [`Option#parser([parser])`](#optionparserparser)
    - [`Option#preset([preset])`](#optionpresetpreset)
    - [`Option#required`](#optionrequired)
    - [`Option#short`](#optionshort)
    - [`Option#toString()`](#optiontostring)
    - [`Option#variadic`](#optionvariadic)
  - [`OptionEvent<T>(option, value, source[, flag])`](#optioneventtoption-value-source-flag)
    - [`OptionEvent#flag`](#optioneventflag)
    - [`OptionEvent#id`](#optioneventid)
    - [`OptionEvent#option`](#optioneventoption)
    - [`OptionEvent#source`](#optioneventsource)
    - [`OptionEvent#value`](#optioneventvalue)
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

## API

### `Argument(info)`

A command argument (class).

#### Signatures

- `constructor(info: ArgumentInfo | string)`
- `constructor(info: string, data?: ArgumentData | null | undefined)`

#### Parameters

- `info` ([`ArgumentInfo`](#argumentinfo-1) | `string`)
  — argument info or syntax
- `data?` ([`ArgumentData`](#argumentdata), optional)
  — additional argument info

#### `Argument#id`

`string`

The argument syntax id.

#### `Argument#required`

`boolean`

Whether the argument must have a value after parsing.

#### `Argument#syntax`

[`ArgumentSyntax`](#argumentsyntax-1)

The normalized argument syntax string.

#### `Argument#choices([choices])`

Get or set argument choices.

##### Overloads

- `choices(): Set<string>`
- `choices(choices: List<string> | null | undefined): this`

##### Parameters

- `choices` ([`List<string>`](#list), optional)
  — list of argument choices

##### Returns

(`Set<string>` | [`this`](#argumentinfo)) List of argument choices or `this` argument

#### `Argument#default([info])`

Get or set the default value configuration.

##### Overloads

- `default<T>(): DefaultInfo<T>`
- `default(info: DefaultInfo | null | undefined): this`

##### Type Parameters

- `T` (`any`)
  — default value type

##### Parameters

- `info` ([`DefaultInfo`](#defaultinfo), optional)
  — default value info

##### Returns

([`DefaultInfo<T>`](#defaultinfo) | `this`) Default value info or `this` argument

#### `Argument#description([description])`

Get or set the argument description.

Pass `null`, `undefined`, or an empty string to remove the argument from the auto-generated help text.

##### Overloads

- `description(): string`
- `description(description: URL | string | null | undefined): this`

##### Parameters

- `description` (`URL | string`, optional)
  — the argument description

##### Returns

(`string` | [`this`](#argumentinfo)) Description of `this` argument or `this` argument

#### `Argument#parser([parser])`

Get or set the handler used to parse command-arguments.

##### Overloads

- `parser<T, V extends string | string[] = string | string[]>(): ParseArg<T, V>`
- `parser(parser: ParseArg<any, any> | null | undefined): this`

##### Type Parameters

- `T` (`any`)
  — parse result
- `V` (`string | string[]`, optional)
  — the argument or arguments to parse

##### Parameters

- `parser` ([`ParseArg<any, any>`](#parsearg) | `null | undefined`)
  — the command-argument parser

##### Returns

([`ParseArg<T, V>`](#parsearg) | `this`) The command-argument parser or `this` argument

#### `Argument#toString()`

Get the human readable equivalent of the argument.

##### Returns

(`string`) String representation of `this` argument

#### `Argument#variadic`

`boolean`

Whether the argument can be specified multiple times.

### `Command(info)`

#### Signatures

**TODO**: `Command` signatures

#### Parameters

**TODO**: `Command` parameters

#### `Command#action([action])`

**TODO**: `Command#action([action])`

#### `Command#addArgument(argument)`

**TODO**: `Command#addArgument(argument)`

#### `Command#addCommand(subcommand)`

**TODO**: `Command#addCommand(subcommand)`

#### `Command#addOption(option)`

**TODO**: `Command#addOption(option)`

#### `Command#alias([alias])`

**TODO**: `Command#alias([alias])`

#### `Command#aliases([aliases])`

**TODO**: `Command#aliases([aliases])`

#### `Command#ancestors()`

**TODO**: `Command#ancestors()`

#### `Command#args`

**TODO**: `Command#args`

#### `Command#argument(info[, data])`

**TODO**: `Command#argument(info[, data])`

#### `Command#arguments([infos])`

**TODO**: `Command#arguments([infos])`

#### `Command#argv`

**TODO**: `Command#argv`

#### `Command#command(info[, data])`

**TODO**: `Command#command(info[, data])`

#### `Command#commands([infos])`

**TODO**: `Command#commands([infos])`

#### `Command#copyInheritedSettings(parent)`

**TODO**: `Command#copyInheritedSettings(parent)`

#### `Command#createArgument(info[, data])`

**TODO**: `Command#createArgument(info[, data])`

#### `Command#createCommand(info[, data])`

**TODO**: `Command#createCommand(info[, data])`

#### `Command#createOption(info[, data])`

**TODO**: `Command#createOption(info[, data])`

#### `Command#default`

**TODO**: `Command#default`

#### `Command#defaultCommand`

**TODO**: `Command#defaultCommand`

#### `Command#description([description])`

**TODO**: `Command#description([description])`

#### `Command#done([done])`

**TODO**: `Command#done([done])`

#### `Command#emit(event)`

**TODO**: `Command#emit(event)`

#### `Command#emitOption(option, value, source[, flags])`

**TODO**: `Command#emitOption(option, value, source[, flags])`

#### `Command#error(info)`

**TODO**: `Command#error(info)`

#### `Command#exit([e])`

**TODO**: `Command#exit([e])`

#### `Command#exiter([exit])`

**TODO**: `Command#exiter([exit])`

#### `Command#findCommand(x)`

**TODO**: `Command#findCommand(x)`

#### `Command#findOption(flag[, direction])`

**TODO**: `Command#findOption(flag[, direction])`

#### `Command#hidden`

**TODO**: `Command#hidden`

#### `Command#hide([hidden])`

**TODO**: `Command#hide([hidden])`

#### `Command#id([name])`

**TODO**: `Command#id([name])`

#### `Command#logger`

**TODO**: `Command#logger`

#### `Command#on<T>(event, listener[, options])`

**TODO**: `Command#on<T>(event, listener[, options])`

#### `Command#option(info[, data])`

**TODO**: `Command#option(info[, data])`

#### `Command#optionValue(key[, value][, source])`

**TODO**: `Command#optionValue(key[, value][, source])`

#### `Command#optionValueSource(key[, source])`

**TODO**: `Command#optionValueSource(key[, source])`

#### `Command#options([infos])`

**TODO**: `Command#options([infos])`

#### `Command#opts<T>()`

**TODO**: `Command#opts<T>()`

#### `Command#optsWithGlobals<T>()`

**TODO**: `Command#optsWithGlobals<T>()`

#### `Command#parent`

**TODO**: `Command#parent`

#### `Command#parse([argv][, options])`

**TODO**: `Command#parse([argv][, options])`

#### `Command#parseAsync([argv][, options])`

**TODO**: `Command#parseAsync([argv][, options])`

#### `Command#process`

**TODO**: `Command#process`

#### `Command#snapshot()`

**TODO**: `Command#snapshot()`

#### `Command#summary([summary])`

**TODO**: `Command#summary([summary])`

#### `Command#toString()`

**TODO**: `Command#toString()`

#### `Command#unknown`

**TODO**: `Command#unknown`

#### `Command#unknowns(strategy)`

**TODO**: `Command#unknowns(strategy)`

#### `Command#usage([usage])`

**TODO**: `Command#usage([usage])`

#### `Command#version([version])`

**TODO**: `Command#version([version])`

### `CommandError(info)`

#### Extends

- [`KronkError`](#kronkerrorinfo)

#### Parameters

- `info` ([`CommandErrorInfo`](#commanderrorinfo-2))
  — info about the error

#### `CommandError#command`

**TODO**: `CommandError#command`

#### `CommandError#snapshot()`

**TODO**: `CommandError#snapshot()`

### `KronkError(info)`

#### Extends

- `Error`

#### Signatures

**TODO**: `KronkError` signatures

#### Parameters

**TODO**: `KronkError` parameters

#### `KronkError#additional`

**TODO**: `KronkError#additional`

#### `KronkError#cause`

**TODO**: `KronkError#cause`

#### `KronkError#code`

**TODO**: `KronkError#code`

#### `KronkError#id`

**TODO**: `KronkError#id`

#### `KronkError#toJSON()`

**TODO**: `KronkError#toJSON()`

#### `KronkError#toString()`

**TODO**: `KronkError#toString()`

### `KronkEvent(id)`

An event (class).

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

A command option (class).

#### Signatures

- `constructor(info: Flags | OptionInfo)`
- `constructor(info: Flags, data?: OptionData | null | undefined)`

#### Parameters

- `info` ([`Flags`](#flags) | [`OptionInfo`](#optioninfo-1))
  — option flags or info
- `data?` ([`OptionData`](#optiondata), optional)
  — additional option info

#### `Option#boolean`

`boolean`

Whether the option is a boolean option.
Boolean options are options that do not take any option-arguments.

#### `Option#choices([choices])`

Get or set option choices.

##### Overloads

- `choices(): Set<string>`
- `choices(choices: List<string> | null | undefined): this`

##### Parameters

- `choices` ([`List<string>`](#list), optional)
  — list of option choices

##### Returns

(`Set<string>` | [`this`](#optioninfo)) List of option choices or `this` option

#### `Option#default([info])`

Get or set the default value configuration.

##### Overloads

- `default<T>(): DefaultInfo<T>`
- `default(info: DefaultInfo | null | undefined): this`

##### Type Parameters

- `T` (`any`)
  — default value type

##### Parameters

- `info` ([`DefaultInfo`](#defaultinfo), optional)
  — default value info

##### Returns

([`DefaultInfo<T>`](#defaultinfo) | `this`) Default value info or `this` option

#### `Option#description([description])`

Get or set the option description.

##### Overloads

- `description(): string`
- `description(description: URL | string | null | undefined): this`

##### Parameters

- `description` (`URL | string`)
  — the option description

##### Returns

(`string` | [`this`](#optioninfo)) Description of `this` option or `this` option

#### `Option#env([env])`

Get or set the environment variables to check for the value of the option.

##### Overloads

- `env(): Set<string>`
- `env(env: List<string> | string | null | undefined): this`

##### Parameters

- `env` ([`List<string>`](#list) | `string | null | undefined`)
  — the name of the environment variable to check, or a list of names, in order of priority, to check

##### Returns

(`string` | [`this`](#optioninfo)) Environment variable names or `this` option

#### `Option#event`

[`OptionEventName`](#optioneventname)

The event name for the option.

#### `Option#flags`

[`Flags`](#flags)

The normalized option flags string.

#### `Option#hidden`

`boolean`

Whether the option should **not** be displayed in help text.

#### `Option#hide([hidden])`

Remove the option from help text.

##### Parameters

- `hidden` (`boolean | null | undefined`, optional)
  — whether the option should be hidden
  - default: `true`

##### Returns

([`this`](#optioninfo)) `this` option

#### `Option#id`

`string`

The option id.

#### `Option#key`

`string`

The option [`id`](#optionid) in a format that can be used an object property key.

#### `Option#long`

`string | null`

The long flag for the option.
If `null`, the [`short`](#optionshort) flag will be a non-empty string.

#### `Option#mandatory`

`boolean`

Whether the option must have a value after parsing.

#### `Option#optional`

`boolean`

Whether a value is optional when the option is specified.

#### `Option#parser([parser])`

Get or set the handler used to parse option-arguments.

##### Overloads

- `parser<T, V extends string | string[] = string | string[]>(): ParseArg<T, V>`
- `parser(parser: ParseArg<any, any> | null | undefined): this`

##### Type Parameters

- `T` (`any`)
  — parse result
- `V` (`string | string[]`, optional)
  — the argument or arguments to parse

##### Parameters

- `parser` ([`ParseArg<any, any>`](#parsearg) | `null | undefined`)
  — the option-argument parser

##### Returns

([`ParseArg<T, V>`](#parsearg) | `this`) The option-argument parser or `this` option

#### `Option#preset([preset])`

Get or set the preset to use when the option is specified without an argument.

The option-argument [`parser`](#optionparserparser) will be called.

##### Overloads

- `preset(): string | null`
- `preset(preset: string | null | undefined): this`

##### Parameters

- `preset` (`string | null | undefined`)
  — the option-argument preset

##### Returns

(`string | this | null`) The option-argument preset or `this` option

#### `Option#required`

`boolean`

Whether a value must be supplied when the option is specified.

#### `Option#short`

`string | null`

The short flag for the option.
If `null`, the [`long`](#optionlong) flag will be a non-empty string.

#### `Option#toString()`

Get the option as a human-readable string.

##### Returns

(`string`) String representation of `this` option

#### `Option#variadic`

`boolean`

Whether the option can be specified multiple times.

### `OptionEvent<T>(option, value, source[, flag])`

A parsed option event (class).

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

[`Flags | null | undefined`](#flags)

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

### `VersionOption(info)`

A command version option (class).

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
  — the current command or subcommand being executed
- `options` (`Opts`)
  — parsed command options
- `...args` (`Args`)
  — parsed command arguments

#### Returns

([`Awaitable<null | undefined | void>`](#awaitable)) Nothing

### `ArgumentData`

Data transfer object for command-arguments (TypeScript interface).

#### Properties

- `choices?` ([`List<string>`](#list), optional)
  — list of argument choices
- `default?` ([`DefaultInfo`](#defaultinfo), optional)
  — default value configuration
- `description?` (`URL | string`, optional)
  — description of the argument
- `parser?` ([`ParseArg<any, any>`](#parsearg), optional)
  — handler used to parse command-arguments.\
  the handler receives two parameters, the raw, unparsed command-argument (or *command-arguments* for variadic options),
  and the previous (default) value for the argument. it should return the new value for the argument

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

#### Properties

- `action?` ([`Action<any>`](#action), optional)
  — callback to fire when the command is executed
- `aliases?` ([`List<string>`](#list) | `string`, optional)
  — aliases for the command
- `arguments?` ([`List<string>`](#list), optional)
  — arguments for the command
- `default?` (`boolean`, optional)
  — whether this is the default command
- `description?` (`URL | string`, optional)
  — description of the command
- `done?` ([`Action<any>`](#action), optional)
  — callback to fire after the command `action` is executed
- `exit?` ([`Exit`](#exit), optional)
  — callback to fire when the process is exited
- `hidden?` (`boolean`, optional)
  — whether the command should be not displayed in help text
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
- `options` ([`Map<string, Option>`](#optioninfo))
  — map, where each key is a long or short flag and each value is the command option instance registered for that flag
- `parent?` (`null | undefined`)
  — the parent command
- `subcommands` ([`Map<string, Command>`](#commandinfo))
  — map, where each key is the name of a subcommand each value is a subcommand
- `version` ([`VersionOption`](#versionoptioninfo) | `null | undefined`)
  — command version option

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

#### Properties

- `choices?` ([`List<string>`](#list), optional)
  — list of option choices
- `default?` ([`DefaultInfo`](#defaultinfo), optional)
  — default value configuration
  > 👉 **note**: the option-argument `parser` will not be called.
- `description?` (`URL | string`, optional)
  — description of the option
  - default: `''`
- `env?` ([`List<string>`](#list)| `string`, optional)
  — the name of the environment variable to check for option value, or a list of names, in order of priority, to check
- `hidden?` (`boolean`, optional)
  — whether the option should be not displayed in help text
  - default: `false`
- `mandatory?` (`boolean`, optional)
  — whether the option is mandatory. mandatory options must have a value after parsing, which usually means the option
  must be specified on the command line
  - default: `false`
- `parser?` ([`ParseArg<any, string> | ParseArg<any, string[]>`](#parsearg), optional)
  — handler used to parse option-arguments. the handler receives two parameters, the raw, unparsed option-argument (or
  *option-arguments* for variadic options), and the previous (default) value for the argument. it should return the new
  value for the argument
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

#### Properties

- `long` (`string | null | undefined`)
  — long flag
- `optional` (`boolean`)
  — whether a value is optional when the option is specified
- `required` (`boolean`)
  — whether a value must be supplied when the option is specified
- `short` (`string | null | undefined`)
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
- `previous` (`T | undefined`)
  — the default argument value

#### Returns

(`T`) Parse result

### `ParseOptions`

Options for parsing command-line arguments (TypeScript interface).

#### Properties

- `from?` ([`ArgvSource`](#argvsource), optional)
  — the source of the command line arguments

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
  - default: `'[options]'`
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

[meanings]: http://www.catb.org/~esr/writings/taoup/html/ch10s05.html

[nodejs]: https://nodejs.org

[typescript]: https://www.typescriptlang.org

[writestream]: https://github.com/flex-development/log#writestream

[yarn]: https://yarnpkg.com
