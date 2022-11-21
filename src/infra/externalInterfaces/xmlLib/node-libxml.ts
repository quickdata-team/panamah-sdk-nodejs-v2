import Libxml from 'node-libxml';

import path from 'path';

export class NodeLibxml {
  private libxml = new Libxml();

  private schemaPath = path.join(__dirname, './schemas/'); // TO-DO: Criar logica melhor

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
}
