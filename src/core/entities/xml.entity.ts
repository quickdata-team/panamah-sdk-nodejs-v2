import { readFileSync } from 'fs';
import {
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from '@errors';

import { LibXml } from '@infra';

export class Xml extends LibXml {
  public xmlIsWellformed: boolean = false;

  public nfeIsValid: boolean | null = false;

  public nfeContent: string = '';

  /**
   * Valida um XML
   * @return {*}  {(boolean
   *     | XMLBadRequestError
   *     | NFEschemasBadRequestError
   *     | NFEBadRequestError)}
   * @memberof Xml
   */
  validate():
    | boolean
    | XMLBadRequestError
    | NFEschemasBadRequestError
    | NFEBadRequestError {
    if (!this.xmlIsWellformed) throw new XMLBadRequestError();

    this.nfeIsValid = this.libValidate();

    if (this.nfeIsValid === null) throw new NFEschemasBadRequestError();
    if (this.nfeIsValid === false) throw new NFEBadRequestError();

    return true;
  }

  /**
   * Carrega um XML a partir de um path
   * @param {string} path
   * @return {*}  {(boolean | XMLBadRequestError)}
   * @memberof Xml
   */
  loadFromPath(path: string): boolean | XMLBadRequestError {
    try {
      this.xmlIsWellformed = this.libLoadFromPath(path);
      this.nfeContent = readFileSync(path, 'utf-8');
      if (!this.xmlIsWellformed) throw new XMLBadRequestError();
      return true;
    } catch (error) {
      throw new XMLBadRequestError();
    }
  }

  /**
   * Carrega um XML a partir de uma string
   * @param {string} xmlContent
   * @return {*}  {(boolean | XMLBadRequestError)}
   * @memberof Xml
   */
  loadFromString(xmlContent: string): boolean | XMLBadRequestError {
    try {
      this.xmlIsWellformed = this.libLoadFromString(xmlContent);
      this.nfeContent = xmlContent;
      if (!this.xmlIsWellformed) throw new XMLBadRequestError();
      return true;
    } catch (error) {
      throw new XMLBadRequestError();
    }
  }

  /**
   * Transforma XML em JSON
   * @param {*} xmlFile XML
   * @return {*}  {*} JSON
   * @memberof NodeLibxml
   */
  xml2json(xmlFile: any): any {
    return this.libXml2json(xmlFile);
  }

  /**
   * Transforma JSON em XML
   * @param {*} jsonFile JSON
   * @return {*}  {*} XML
   * @memberof NodeLibxml
   */
  json2xml(jsonFile: any): any {
    return this.libJson2xml(jsonFile);
  }

  /**
   * Busca CNPJ em um objeto NFE
   * @static
   * @param {*} json
   * @return {*}  {string}
   * @memberof Xml
   */
  static getCnpj(json: any): string {
    let cnpj = '0';
    try {
      let nfe = json;

      // Verificação de tag externa
      if (nfe.nfeProc) {
        nfe = nfe.nfeProc;
      }

      nfe = nfe.NFe;
      nfe = nfe.infNFe.emit;

      // Conciliação CNPJ e CPF
      if (nfe.CNPJ) {
        // eslint-disable-next-line no-underscore-dangle
        cnpj = nfe.CNPJ._text;
      } else {
        // eslint-disable-next-line no-underscore-dangle
        cnpj = nfe.CPF._text;
      }
    } catch (error) {
      /* empty */
    }
    return cnpj;
  }
}
