import { HttpClient, IHttpClient } from '@infra';
import { AuthenticationEntity, Subscriber } from '@entities';
import {
  BaseError,
  SubscriberBadRequestError,
  InternalServerError,
  NotFoundSubscriberError,
  UnauthorizedPartnerError,
} from '@errors';

interface ICredentials {
  username: string;
  password: string;
}

export class AdministrativeUseCase {
  private authEntity!: AuthenticationEntity;

  private httpClient!: IHttpClient;

  constructor(authEntity: AuthenticationEntity) {
    this.authEntity = authEntity;
    this.httpClient = new HttpClient();
  }

  public async init(credentials: ICredentials): Promise<any> {
    await this.authEntity.authenticate(credentials);
  }

  private checkAuthorized() {
    if (!this.authEntity.isAuthenticated()) {
      throw new UnauthorizedPartnerError();
    }
  }

  public async createSubscriber(data: Subscriber): Promise<any> {
    try {
      this.checkAuthorized();
      Subscriber.validate(data);
      return this.httpClient.post(
        '/admin/assinantes',
        data,
        this.authEntity.getTokens().accessToken
      );
    } catch (err) {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new InternalServerError();
    }
  }

  public async updateSubscriber(id: string, data: any): Promise<any> {
    this.checkAuthorized();

    if (!('nome' in data) || !('fantasia' in data)) {
      throw new SubscriberBadRequestError();
    }

    Object.assign(data, {
      ...data,
      id,
    });
    try {
      return this.httpClient.put(
        `/admin/assinantes/${id}`,
        data,
        this.authEntity.getTokens().accessToken
      );
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) throw new NotFoundSubscriberError();
      }
      throw new InternalServerError();
    }
  }

  public async getSubscriber(id: string): Promise<Subscriber> {
    this.checkAuthorized();

    try {
      const assinante = await this.httpClient.get(
        `/admin/assinantes/${id}`,
        this.authEntity.getTokens().accessToken
      );
      return assinante;
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) throw new SubscriberBadRequestError();
      }
      throw new InternalServerError();
    }
  }

  public async deleteSubscriber(id: string): Promise<any> {
    this.checkAuthorized();

    try {
      return await this.httpClient.delete(
        `/admin/assinantes/${id}`,
        this.authEntity.getTokens().accessToken
      );
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) throw new SubscriberBadRequestError();
      }
      throw new InternalServerError();
    }
  }
}
