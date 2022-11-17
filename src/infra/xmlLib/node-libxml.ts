import Libxml from 'node-libxml';

export class LibXml {
  private libxml = new Libxml(); // Lib de XML

  private schemaPath = 'schemas/'; // TO-DO: Criar logica melhor

  /**
   * @param {string} path
   * @return {*}
   * @memberof LibXml
   */
  libLoadFromPath(path: string): boolean {
    return this.libxml.loadXml(path);
  }

  /**
   * @param {string} xmlContent
   * @return {*}
   * @memberof LibXml
   */
  libLoadFromString(xmlContent: string): boolean {
    return this.libxml.loadXmlFromString(xmlContent);
  }

  /**
   * @return {*}
   * @memberof LibXml
   */
  libValidate(): string | boolean | null {
    this.libxml.loadSchemas([
      `${this.schemaPath}nfe_v4.00.xsd`,
      `${this.schemaPath}procNFe_v4.00.xsd`,
    ]);

    return this.libxml.validateAgainstSchemas();
  }
}
