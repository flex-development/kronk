declare namespace NodeJS {
  /**
   * User environment.
   *
   * @extends {Dict<string>}
   */
  interface ProcessEnv extends Dict<string> {
    /**
     * Path to current working directory.
     */
    PWD?: string | undefined
  }
}
