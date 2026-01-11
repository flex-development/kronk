# Parsing and Hook Flow

Parsing starts with the root command, *program*, and an array of unknown arguments.\
Each subsequent command then processes and removes known arguments (i.e. options, subcommands), and passes down
remaining arguments to the next command. The final (running) command calls the action handler.

```mermaid
flowchart TD
    A[program]
    A --> B

    B[unknown arguments] --> C[emit known arguments]
    C --> D[emitImpliedOptions]
    D --> E[emitEnvironmentOptions]

    E --> F{first operand is subcommand?}
    F -- yes --> G[preCommand hooks]
    G --> H[subcommand]
    H --> B

    F -- no --> I{help or version requested?}
    I -- yes --> V[preAction hooks]

    I -- no --> J{defaultCommand?}
    J -- yes --> K[preCommand hooks]
    K --> L[defaultCommand]
    L --> B

    J -- no --> M[checkForMissingMandatoryOptions]
    M -->|CommandError| M_ERR[kronk/missing-mandatory-option]

    M --> N[checkDependentOptions]
    N -->|CommandError| N_ERR[kronk/missing-dependee-option]

    N --> O[checkForConflictingOptions]
    O -->|CommandError| O_ERR[kronk/conflicting-option]

    O --> P[checkForUnknownOptions]
    P -->|CommandError| P_ERR[kronk/unknown-option]

    P --> Q[checkCommandArguments]
    Q --> R{missing arguments?}

    R -- CommandError --> R_ERR[kronk/missing-argument]
    R -- no --> S{too many arguments?}

    S -- CommandError --> S_ERR[kronk/excess-arguments]
    S -- no --> T[parseCommandArguments]
    T --> U[resolve parsed option values]

    U --> V
    V --> W[action]
    W --> X[postAction hooks]
```
