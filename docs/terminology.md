# Terminology

Command-line arguments are made up of operands, options (aka flags), and option-arguments.

- ***action***: the callback to fire when a command is run
- ***boolean option***: an option that does not take any arguments
- ***command-argument***: an argument for a command (not an option or *option-argument*)
- ***defaultCommand***: the default *subcommand*
- ***dependee option***: an option that is required by another option
- ***dependent option***: an option that requires another option
- ***flag***: see *option*
- ***mandatory option***: an option that must have a value after parsing
- ***operand***: a (sub)command alias, (sub)command name, or *command-argument*
- ***option***: an argument starting with `-` or `--`, followed by a single character or word (i.e, `-s`, `--long`)
- ***option-argument***: an argument for an *option* (that takes arguments)
- ***optional option***: an option that can take an argument, but does not require it
- ***program***: the root command
- ***required option***: an option that requires an argument
- ***structural command***: a command that has *subcommands*, but no defined *action*
- ***subcommand***: a child command

For example:

```sh
program -o --option option-argument command --flag=option-argument command-argument-0 command-argument-1
```
