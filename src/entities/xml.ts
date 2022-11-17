import {
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from '../presentation/errors';

import { LibXml } from '../infra/xmlLib';

export class Xml extends LibXml {
  public xmlIsWellformed!: boolean; // Se o XML é valido

  public nfeIsValid!: string | boolean | null; // Se a NFE é valida

  validate(): boolean {
    if (!this.xmlIsWellformed) throw new XMLBadRequestError();

    this.nfeIsValid = this.libValidate();

    if (this.nfeIsValid === null) throw new NFEschemasBadRequestError();
    if (this.nfeIsValid === false) throw new NFEBadRequestError();

    return true;
  }

  loadFromPath(path: string): boolean {
    try {
      this.xmlIsWellformed = this.libLoadFromPath(path);
      if (!this.xmlIsWellformed) throw new XMLBadRequestError();
      return true;
    } catch (error) {
      throw new XMLBadRequestError();
    }
  }

  loadFromString(xmlContent: string): boolean {
    try {
      this.xmlIsWellformed = this.libLoadFromString(xmlContent);
      if (!this.xmlIsWellformed) throw new XMLBadRequestError();
      return true;
    } catch (error) {
      throw new XMLBadRequestError();
    }
  }
}
