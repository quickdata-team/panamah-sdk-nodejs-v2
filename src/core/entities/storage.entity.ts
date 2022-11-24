import { Xml } from './xml.entity';
import { LibNfe, LibStorage } from '../../infra/adaptors';

export class Storage extends LibNfe {
  private dirNfe = `/tmp/nfe`;

  createDir(): void {
    if (!LibStorage.isDirExists(this.dirNfe)) {
      LibStorage.createDir(this.dirNfe);
    }
  }

  createFileName(XML: Xml): string {
    return this.getNfeId(XML.nfeContent);
  }

  save(fileName: string, XML: Xml): void {
    LibStorage.saveFile(`${this.dirNfe}/${fileName}`, XML.nfeContent);
  }

  getFileList(): string[] {
    return LibStorage.readDirFiles(this.dirNfe);
  }
}
