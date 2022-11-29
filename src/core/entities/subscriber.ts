import { Draft07, Draft, JSONError } from 'json-schema-library';
import { SubscriberBadRequestError } from './erro';

export class Subscriber {
  id!: string;

  nome?: string;

  fantasia?: string;

  bairro?: string;

  cidade?: string;

  ramo?: string;

  uf?: string;

  xstatus!: number;

  chave?: string;

  dataAtivacao?: Date;

  emissorPanama?: number;

  funcionarioAtivador?: string;

  primeiroLogin?: Date;

  bsBoardId?: number;

  bsBoardToken?: string;

  cmRevendaId?: string;

  bsBoardAtivo!: number;

  ativo!: number;

  createdAt?: Date;

  updatedAt?: Date;

  container?: string;

  partnerSoftwareId?: string;

  identificadorDashBoard?: string;

  oficial!: number;

  creatorHost?: number;

  creatorSdkIdentity?: string;

  cnpj?: number;

  static tableName = 'assinantes';

  static idColumn = ['id'];

  static jsonSchema = {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      nome: {
        type: 'string',
        maxLength: 255,
      },
      fantasia: {
        type: 'string',
        maxLength: 255,
      },
      bairro: {
        type: 'string',
        maxLength: 255,
      },
      cidade: {
        type: 'string',
        maxLength: 255,
      },
      ramo: {
        type: 'string',
        maxLength: 255,
      },
      uf: {
        type: 'string',
        maxLength: 2,
      },
      xstatus: {
        type: 'integer',
        default: 1,
      },
      chave: {
        type: 'string',
        maxLength: 100,
      },
      dataAtivacao: {
        type: 'string',
        format: 'date',
      },
      emissorPanama: {
        type: 'string',
        maxLength: 100,
      },
      funcionarioAtivador: {
        type: 'string',
        maxLength: 100,
      },
      primeiroLogin: {
        type: 'string',
        format: 'date',
      },
      bsBoardId: {
        type: 'integer',
      },
      bsBoardToken: {
        type: 'string',
        maxLength: 500,
      },
      cmRevendaId: {
        type: 'string',
        maxLength: 100,
      },
      bsBoardAtivo: {
        type: 'integer',
        default: 0,
      },
      ativo: {
        type: 'integer',
        default: 0,
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
      container: {
        type: 'string',
        maxLength: 255,
      },
      partnerSoftwareId: {
        type: 'string',
        maxLength: 255,
      },
      identificadorDashBoard: {
        type: 'string',
        maxLength: 50,
      },
      oficial: {
        type: 'integer',
        default: 1,
      },
      creatorHost: {
        type: 'string',
        maxLength: 50,
      },
      creatorSdkIdentity: {
        type: 'string',
        maxLength: 100,
      },
      cnpj: {
        type: 'number',
      },
    },
  };

  /**
   * Valida um objeto (any) usando o schema de assinante
   * @static
   * @param {*} subscriber
   * @return {*}  {(Subscriber | SubscriberBadRequestError)}
   * @memberof Subscriber
   */
  static validate(subscriber: any): true | SubscriberBadRequestError {
    const jsonSchema: Draft = new Draft07(this.jsonSchema);
    const errors: JSONError[] = jsonSchema.validate(subscriber);

    if (errors.length > 0) {
      throw new SubscriberBadRequestError();
    }
    return true;
  }

  /**
   * Lista os erros de validaçao
   * @static
   * @param {*} subscriber
   * @return {*}  {JSONError[]}
   * @memberof Subscriber
   */
  static getErrors(subscriber: any): JSONError[] {
    const jsonSchema: Draft = new Draft07(this.jsonSchema);
    return jsonSchema.validate(subscriber);
  }
}
