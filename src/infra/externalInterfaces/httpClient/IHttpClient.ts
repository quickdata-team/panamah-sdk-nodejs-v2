/* eslint-disable no-unused-vars */

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthRequest {
  username: string;
  password: string;
}

export interface IHttpClient {
  get(url: string): Promise<any>;
  auth(data: IAuthRequest): Promise<IAuthResponse>;
  refreshTokens(refreshToken: string): Promise<IAuthResponse>;
}
