import axios, { AxiosInstance } from 'axios';

import { IAuthRequest, IAuthResponse, IHttpClient } from '../IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  private httpClient: AxiosInstance;

  private defaultUrl = process.env.PANAMAH_CORE_URL || 'http://localhost:3000';

  constructor(baseUrl?: string) {
    this.httpClient = axios.create({
      baseURL: baseUrl || this.defaultUrl,
      headers: {
        'x-sdk-identity': 'panamah-nodejs-0.0.1',
      },
      timeout: 20000,
    });
  }

  public async get(url: string, token: string): Promise<any> {
    const { data } = await this.httpClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }

  public async post(url: string, payload: any, token: string): Promise<any> {
    const { status, data } = await this.httpClient.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data, status };
  }

  public async postSale(
    url: string,
    payload: any,
    token: string
  ): Promise<any> {
    const { status, data } = await this.httpClient.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/xml',
      },
    });
    return { data, status };
  }

  public async put(url: string, payload: any, token: string): Promise<any> {
    const { status, data } = await this.httpClient.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status, data };
  }

  public async delete(url: string, token: string): Promise<any> {
    const { status, data } = await this.httpClient.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data, status };
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
