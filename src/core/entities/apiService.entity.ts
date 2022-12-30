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
    postSaleRequest: IPostSaleRequest,
    token: string
  ): Promise<IPostSaleResponse> {
    try {
      const { data } = await this.httpClient.post(
        '/stream/data',
        postSaleRequest,
        token
      );
      return data;
    } catch (err) {
      throw new InternalServerError();
    }
  }
}
