import { LibLogger, LibStorage } from '@infra';

export class Logger {
  private static stdOutPath = './stdout';

  private static stdErrPath = './stderr';

  private static LibLogger = new LibLogger(
    Logger.stdOutPath,
    Logger.stdErrPath
  );

  /**
   * Cria log na pasta de logs
   * @static
   * @param {string} text
   * @memberof Logger
   */
  static log(text: string): void {
    this.LibLogger.log(text);
  }

  /**
   * Cria log de erro na pasta de logs
   * @static
   * @param {string} text
   * @memberof Logger
   */
  static err(text: string): void {
    this.LibLogger.error(text);
  }

  static getLogAsObj() {
    return LibStorage.readFileLogAsObj(Logger.stdOutPath);
  }

  static getErrorAsObj() {
    return LibStorage.readFileLogAsObj(Logger.stdErrPath);
  }

  static clearAllLogs() {
    LibStorage.deleteFiles('.', ['stdout', 'stderr']);
    Logger.LibLogger = new LibLogger(Logger.stdOutPath, Logger.stdErrPath);
  }
}
