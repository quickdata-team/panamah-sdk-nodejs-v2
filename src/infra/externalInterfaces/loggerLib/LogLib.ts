import fs from 'fs';
import { Console as NodeConsole } from 'console';

export class LogLib {
  private logger: any;

  constructor(stdOutPath: string, stdErrPath: string) {
    this.logger = new NodeConsole({
      stdout: fs.createWriteStream(stdOutPath),
      stderr: fs.createWriteStream(stdErrPath),
    });
  }

  /**
   * Cria log
   * @param {string} text
   * @memberof LogLib
   */
  public log(text: string): void {
    this.logger.log(`[${new Date().toLocaleString()}] :`, text);
  }

  /**
   * Cria log de erro
   * @param {string} text
   * @memberof LogLib
   */
  public error(text: string): void {
    this.logger.error(`[${new Date().toLocaleString()}] :`, text);
  }
}
