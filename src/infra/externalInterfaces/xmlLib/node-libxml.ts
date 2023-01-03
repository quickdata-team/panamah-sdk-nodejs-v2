import JSZip from 'jszip';

import path from 'path';
import https from 'https';

import { js2xml, xml2js } from 'xml-js';
import Libxml from 'node-libxml';
import { FsLib as LibStorage } from '../storageLib';

export class NodeLibxml {
  private libxml = new Libxml();

  private schemaPath = path.join(__dirname, './schemas/');

  private xmlJsOptions = {
    compact: true,
    ignoreComment: true,
  };

  private async downloadZippedSchemas() {
    const file = LibStorage.writeStream(`${this.schemaPath}files.zip`);
    return new Promise((resolve) => {
      https.get(
        'https://cdn-schemas-xml.panamah.io/v4.00/files.zip',
        (response) => {
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            return resolve(true);
          });
        }
      );
    });
  }

  async loadSchemaFiles() {
    if (LibStorage.isFileExists(`${this.schemaPath}nfe_v4.00.xsd`)) {
      return;
    }
    await this.downloadZippedSchemas();

    const jszip = new JSZip();
    const fileContent = LibStorage.readFile(this.schemaPath, 'files.zip');
    const result = await jszip.loadAsync(fileContent);
    const keys = Object.keys(result.files);

    await Promise.all(
      keys.map(async (key) => {
        const item = result.files[key];
        LibStorage.saveFile(
          `${this.schemaPath}${item.name}`,
          Buffer.from(await item.async('arraybuffer'))
        );
      })
    );
  }

  /**
   * @param {string} filePath
   * @return {*}  {boolean}
   * @memberof NodeLibxml
   */
  libLoadFromPath(filePath: string): boolean {
    return this.libxml.loadXml(filePath);
  }

  /**
   * @param {string} xmlContent
   * @return {*}  {boolean}
   * @memberof NodeLibxml
   */
  libLoadFromString(xmlContent: string): boolean {
    return this.libxml.loadXmlFromString(xmlContent);
  }

  /**
   * Sobre os retornos:
   * True = ok;
   * False = Erro. A NFE não bate com o schema
   * Null = Erro. Nenhum schema carregado
   * @return {*}  {(boolean | null)}
   * @memberof NodeLibxml
   */
  libValidate(): boolean | null {
    this.libxml.loadSchemas([
      `${this.schemaPath}nfe_v4.00.xsd`,
      `${this.schemaPath}procNFe_v4.00.xsd`,
    ]);

    const validate = this.libxml.validateAgainstSchemas();

    if (typeof validate === 'string') return true;
    return validate;
  }

  /**
   * Transforma XML em JSON
   * @param {*} xmlFile XML
   * @return {*}  {*} JSON
   * @memberof NodeLibxml
   */
  libXml2json(xmlFile: any): any {
    return xml2js(xmlFile, this.xmlJsOptions);
  }

  /**
   * Transforma JSON em XML
   * @param {*} jsonFile
   * @return {*}  {*}
   * @memberof NodeLibxml
   */
  libJson2xml(jsonFile: any): any {
    return js2xml(jsonFile, this.xmlJsOptions);
  }
}
