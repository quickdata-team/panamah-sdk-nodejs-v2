import { Draft07, Draft, JSONError } from 'json-schema-library';
import { BadRequestError } from '@errors';

export class Partner {
  id!: string;

  descr!: string;

  createdAt?: Date;

  updatedAt?: Date;

  active!: number;

  static tableName = 'partners';

  static idColumn = ['id'];

  static jsonSchema = {
    type: 'object',
    required: Partner.idColumn,
    properties: {
      id: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
      descr: {
        type: 'string',
        maxLength: 255,
      },
      createdAt: {
        type: 'string',
        format: 'date',
        default: new Date().toISOString(),
      },
      updatedAt: {
        type: 'string',
        format: 'date',
        default: new Date().toISOString(),
      },
      active: {
        type: 'integer',
        default: 1,
      },
    },
  };

  /**
   *  Valida um objeto (any) usando o schema de parceiro
   * @static
   * @param {*} partner
   * @return {*}  {(true | BadRequestError)}
   * @memberof Subscriber
   */
  static validate(partner: any): true | BadRequestError {
    const jsonSchema: Draft = new Draft07(this.jsonSchema);
    const errors: JSONError[] = jsonSchema.validate(partner);

    if (errors.length > 0) {
      throw new BadRequestError();
    }
    return true;
  }

  /**
   * Lista os erros de validaçao
   * @static
   * @param {*} partner
   * @return {*}  {JSONError[]}
   * @memberof Subscriber
   */
  static getErrors(partner: any): JSONError[] {
    const jsonSchema: Draft = new Draft07(this.jsonSchema);
    return jsonSchema.validate(partner);
  }
}
