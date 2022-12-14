import { HttpClient, IHttpClient, IAuthResponse } from '@infra';
import {
  InternalServerError,
  ForbiddenUserError,
  InvalidApiKeyHeaderError,
} from '@errors';

export class AuthenticationEntity {
  private accessToken!: string;

  private refreshToken!: string;

  private expiresIn!: number;

  httpClient: IHttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  public async authenticate({ username, password }: any) {
    try {
      const response = await this.httpClient.auth({ username, password });
      this.setTokens(response);
    } catch (err) {
      if (err.response && err.response.data) {
        const { data } = err.response;
        if (data.statusCode === 4032) throw new ForbiddenUserError();
        if (data.statusCode === 4015) throw new InvalidApiKeyHeaderError();
      }
      throw new InternalServerError();
    }
  }

  public async refreshTokens() {
    const response = await this.httpClient.refreshTokens(this.refreshToken);
    this.setTokens(response);
  }

  public isAuthenticated(): boolean {
    if (this.expiresIn) {
      return this.expiresIn > new Date().getTime();
    }
    return false;
  }

  private setTokens(data: IAuthResponse) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken || this.refreshToken;
    this.expiresIn = new Date().getTime() + data.expiresIn * 1000;
  }

  public getTokens() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }
}
