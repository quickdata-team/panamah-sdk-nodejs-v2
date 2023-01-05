import { LibNfe, LibStorage } from '@infra';
import { resolve } from 'path';

export class Storage extends LibNfe {
  static dirNfe = resolve('/', 'tmp', 'panamahNfe', 'accumulated');
  static sentDirNfe = resolve('/', 'tmp', 'panamahNfe', 'sent');

  /**
   * Caso não exista, cria o diretório de armazenamento das NFE's
   * @memberof Storage
   */
  static createDir(): void {
    if (!LibStorage.isDirExists(this.dirNfe)) {
      LibStorage.createDir(this.dirNfe);
    }

    if (!LibStorage.isDirExists(this.sentDirNfe)) {
      LibStorage.createDir(this.sentDirNfe);
    }
  }

  /**
   * Cria um nome (único) para o XML
   * @param {Xml} XML
   * @return {*}  {string}
   * @memberof Storage
   */
  static createFileName(XML: any): string {
    return this.getNfeId(XML.nfeContent);
  }

  /**
   * Salva o XML para ser enviado no próximo batch
   * @param {string} fileName
   * @param {Xml} XML
   * @memberof Storage
   */
  static save(fileName: string, XML: any): void {
    LibStorage.saveFile(`${this.dirNfe}/${fileName}`, XML.nfeContent);
  }

  /**
   * Busca o nome dos arquivos armazenados
   * @return {*}  {string[]}
   * @memberof Storage
   */
  static getFileList(): string[] {
    return LibStorage.readDirFiles(this.dirNfe);
  }

  static getFilesSize(fileNames: string[]): number {
    return LibStorage.getDirSize(this.dirNfe, fileNames);
  }

  /**
   * Gera uma lista com o nome dos arquivos enviados
   * @returns {*} {string[]}
   */
  static getListSentFiles(): string[] {
    return LibStorage.readDirFiles(this.sentDirNfe);
  }

  static loadFile(fileName: string): string {
    return LibStorage.readFile(this.dirNfe, fileName);
  }

  static deleteFiles(fileNames: string[]): void {
    // Mover arquivos para a pasta de enviados
    LibStorage.moveFiles(this.dirNfe, this.sentDirNfe, fileNames);

    // Deletar arquivos acumulados
    LibStorage.deleteFiles(this.dirNfe, fileNames);
  }

  static clearStorage(): void {
    const files = LibStorage.readDirFiles(this.dirNfe);
    LibStorage.deleteFiles(this.dirNfe, files);
  }

  static getOldestFile(fileNames: string[]): number {
    return LibStorage.getOldestFile(this.dirNfe, fileNames);
  }
}
