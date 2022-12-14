import {
  HttpClient,
  IHttpClient,
  IPostSaleResponse,
  IPostSaleRequest,
} from '../../infra/adaptors';
import { InternalServerError } from './erro';

export class ApiServiceEntity {
  httpClient: IHttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  public async postSale(
    postSaleRequest: IPostSaleRequest
  ): Promise<IPostSaleResponse> {
    try {
      const post = await this.httpClient.post('/postData', postSaleRequest);
      return post;
    } catch (err) {
      throw new InternalServerError();
    }
  }
}