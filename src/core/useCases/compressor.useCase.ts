import { Xml } from '../entities/xml.entity';
import { Storage } from '../entities/storage.entity';

export class Compressor extends Storage {
  public authetication: boolean = true;

  public send(nfeContent: string, fromPath = true): void {
    const XML = new Xml();

    // Carrega XML
    if (fromPath) {
      XML.loadFromPath(nfeContent);
    } else {
      XML.loadFromString(nfeContent);
    }

    // Valida XML
    XML.validate();

    // Autentica usuario
    this.authenticate();

    // Cria diretorio para salvar o XML
    this.createDir();

    // Cria nome unico
    const fileName = this.createFileName(XML);

    // Salva XML
    this.save(fileName, XML);
  }

  private authenticate() {
    return this.authetication;
  }
}
