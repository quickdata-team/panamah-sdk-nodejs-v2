import { Xml } from './xml.entity';
import { LibNfe, LibStorage } from '../../infra/adaptors';

export class Storage extends LibNfe {
  private static dirNfe = `/tmp/nfe`;

  /**
   * Caso não exista, cria o diretório de armazenamento das NFE's
   * @memberof Storage
   */
  static createDir(): void {
    if (!LibStorage.isDirExists(this.dirNfe)) {
      LibStorage.createDir(this.dirNfe);
    }
  }

  /**
   * Cria um nome (único) para o XML
   * @param {Xml} XML
   * @return {*}  {string}
   * @memberof Storage
   */
  static createFileName(XML: Xml): string {
    return this.getNfeId(XML.nfeContent);
  }

  /**
   * Salva o XML para ser enviado no próximo batch
   * @param {string} fileName
   * @param {Xml} XML
   * @memberof Storage
   */
  static save(fileName: string, XML: Xml): void {
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

  static loadFile(fileName: string): string {
    return LibStorage.readFile(this.dirNfe, fileName);
  }

  static deleteFiles(fileNames: string[]) {
    LibStorage.deleteFiles(this.dirNfe, fileNames);
  }

  static clearStorage(): void {
    const files = LibStorage.readDirFiles(this.dirNfe);
    LibStorage.deleteFiles(this.dirNfe, files);
  }
}
