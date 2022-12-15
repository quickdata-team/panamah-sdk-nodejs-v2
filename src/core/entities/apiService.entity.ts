import {
  HttpClient,
  IHttpClient,
  IPostSaleResponse,
  IPostSaleRequest,
} from '@infra';
import { InternalServerError } from '@errors';

export class ApiServiceEntity {
  httpClient: IHttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  public async postSale(
    postSaleRequest: IPostSaleRequest
  ): Promise<IPostSaleResponse> {
    try {
      const { data } = await this.httpClient.post(
        '/postData',
        postSaleRequest,
        ''
      );
      return data;
    } catch (err) {
      throw new InternalServerError();
    }
  }
}
