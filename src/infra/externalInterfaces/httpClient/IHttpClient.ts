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

export interface ILimitsParameters {
  sizeLimitInBytes: number;
  timeLimitInMs: number;
}

export interface IPostSaleResponse {
  newParameters: ILimitsParameters;
}

export interface IPostSaleRequest {
  data: {
    id: string;
    content: string;
  }[];
}

export interface IHttpClient {
  get(url: string): Promise<any>;
  post(url: string, data: any): Promise<any>;
  auth(data: IAuthRequest): Promise<IAuthResponse>;
  refreshTokens(refreshToken: string): Promise<IAuthResponse>;
}
