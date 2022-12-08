import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  createWriteStream,
  readFileSync,
} from 'fs';

export class FsLib {
  static isFileExists(filePath: string): boolean {
    return existsSync(filePath);
  }

  static isDirExists(dirPath: string): boolean {
    return existsSync(dirPath);
  }

  static createDir(dirPath: string): void {
    mkdirSync(dirPath);
  }

  static saveFile(filePath: string, fileContent: string | Buffer): void {
    writeFileSync(filePath, fileContent);
  }

  static readDirFiles(dirPath: string): string[] {
    return readdirSync(dirPath);
  }

  static writeStream(filePath: string) {
    return createWriteStream(filePath);
  }

  static readFile(filePath: string) {
    return readFileSync(filePath);
  }
}
