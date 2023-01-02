/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
export class NfeXml {
  private static nfeIdTag = 'infNFe';

  private static nfeIdAttribute = 'Id';

  private static xmlParse = require('djf-xml');

  static getNfeId(xmlContent: string): string {
    const xml = NfeXml.xmlParse(xmlContent);
    return xml.tagValue(this.nfeIdTag, this.nfeIdAttribute);
  }
}
