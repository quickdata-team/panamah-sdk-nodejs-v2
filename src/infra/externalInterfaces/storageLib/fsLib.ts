import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  createWriteStream,
  statSync,
  readFileSync,
  rmSync,
  copyFileSync,
} from 'fs';
import { resolve } from 'path';

export type LogObj = {
  date: string;
  hour: string;
  message: string;
}[];

export class FsLib {
  static isFileExists(filePath: string): boolean {
    return existsSync(filePath);
  }

  static isDirExists(dirPath: string): boolean {
    return existsSync(dirPath);
  }

  static createDir(dirPath: string): void {
    mkdirSync(dirPath, { recursive: true });
  }

  static saveFile(filePath: string, fileContent: string | Buffer): void {
    writeFileSync(filePath, fileContent);
  }

  static readDirFiles(dirPath: string): string[] {
    if (this.isDirExists(dirPath)) return readdirSync(dirPath);
    return [];
  }

  static writeStream(filePath: string) {
    return createWriteStream(filePath);
  }

  static getDirSize(dirPath: string, fileNames: string[]): number {
    let folderSize = 0;
    for (const fileName of fileNames) {
      const fileWithPath = resolve(dirPath, fileName);
      const stats = statSync(fileWithPath);
      folderSize += stats.size;
    }
    return folderSize;
  }

  static readFile(dirPath: string, fileName: string): string {
    const fileWithPath = resolve(dirPath, fileName);
    return readFileSync(fileWithPath, 'utf-8');
  }

  static moveFiles(sourceDir: string, targetDir: string, fileNames: string[]) {
    for (const fileName of fileNames) {
      const sourcePath = resolve(sourceDir, fileName);
      const targetPath = resolve(targetDir, fileName);
      try {
        copyFileSync(sourcePath, targetPath);
      } catch (error) {
        /* empty */
      }
    }
  }

  static deleteFiles(dirPath: string, fileNames: string[]) {
    for (const fileName of fileNames) {
      const fileWithPath = resolve(dirPath, fileName);
      if (existsSync(fileWithPath)) {
        rmSync(fileWithPath);
      }
    }
  }

  static readFileLogAsObj(path: string): LogObj {
    const logObj = [];
    const lines = readFileSync(path, 'utf8').toString().split('\n');

    // line -> [12/11/2022 8:26:26 PM] : teste
    for (const line of lines) {
      if (line === '') {
        continue;
      }

      // line: 12/11/2022 8:26:26 PM] : teste
      const lineCleanLeft = line.split('[')[1];
      // date -> 12/11/2022
      const date = lineCleanLeft.split(' ')[0];
      // hour -> 8:26:26 PM
      const hour = lineCleanLeft.split(' ')[1];
      // -> teste
      const message = lineCleanLeft.split(': ')[1];

      logObj.push({
        date,
        hour,
        message,
      });
    }

    return logObj;
  }

  static getOldestFile(dirPath: string, fileNames: string[]): number {
    let oldest = 0;
    for (const fileName of fileNames) {
      const fileWithPath = resolve(dirPath, fileName);
      const stats = statSync(fileWithPath);
      const lastModified = stats.mtimeMs;
      if (lastModified > oldest) {
        oldest = lastModified;
      }
    }
    return oldest;
  }
}
