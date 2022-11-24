import { readFileSync } from 'fs';
import {
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from './erro';

import { LibXml } from '../../infra/adaptors';

export class Xml extends LibXml {
  public xmlIsWellformed: boolean = false;

  public nfeIsValid: boolean | null = false;

  public nfeContent: string = '';

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
      this.nfeContent = readFileSync(path, 'utf-8');
      if (!this.xmlIsWellformed) throw new XMLBadRequestError();
      return true;
    } catch (error) {
      throw new XMLBadRequestError();
    }
  }

  loadFromString(xmlContent: string): boolean {
    try {
      this.xmlIsWellformed = this.libLoadFromString(xmlContent);
      this.nfeContent = xmlContent;
      if (!this.xmlIsWellformed) throw new XMLBadRequestError();
      return true;
    } catch (error) {
      throw new XMLBadRequestError();
    }
  }
}
