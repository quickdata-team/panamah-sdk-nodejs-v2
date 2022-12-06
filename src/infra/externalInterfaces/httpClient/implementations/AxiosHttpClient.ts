/* eslint-disable import/no-extraneous-dependencies */
import axios, { AxiosInstance } from 'axios';
import { IAuthRequest, IAuthResponse, IHttpClient } from '../IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  private httpClient: AxiosInstance;

  private defaultUrl = process.env.BASE_URL || 'http://localhost:3000';

  constructor(baseUrl?: string) {
    this.httpClient = axios.create({
      baseURL: baseUrl || this.defaultUrl,
    });
  }

  public async get(url: string): Promise<any> {
    const { data } = await this.httpClient.get(url);
    return data;
  }

  public async auth({
    username,
    password,
  }: IAuthRequest): Promise<IAuthResponse> {
    const basicToken = Buffer.from(`${username}:${password}`).toString(
      'base64'
    );
    const { data } = await this.httpClient.request({
      url: '/auth',
      method: 'post',
      baseURL: process.env.CERBERUS_URL || this.defaultUrl,
      headers: {
        'x-api-key': process.env.CERBERUS_API_KEY || 'KpuVf',
        Authorization: `Basic ${basicToken}`,
      },
    });

    return data;
  }

  public async refreshTokens(refreshToken: string): Promise<IAuthResponse> {
    const { data } = await this.httpClient.request({
      url: '/refresh-token',
      method: 'post',
      baseURL: process.env.CERBERUS_URL || this.defaultUrl,
      headers: {
        'x-api-key': process.env.CERBERUS_API_KEY,
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    return data;
  }
}
