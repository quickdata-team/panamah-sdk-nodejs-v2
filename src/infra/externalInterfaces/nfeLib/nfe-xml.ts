/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
export class NfeXml {
  private nfeIdTag = 'infNFe';

  private nfeIdAttribute = 'Id';

  private xmlParse = require('djf-xml');

  getNfeId(xmlContent: string): string {
    const xml = this.xmlParse(xmlContent);
    return xml.tagValue(this.nfeIdTag, this.nfeIdAttribute);
  }
}
