/* eslint-disable import/no-extraneous-dependencies */
import axios, { AxiosInstance } from 'axios';
import { IHttpClient } from '../IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
    });
  }

  public async get(url: string): Promise<any> {
    const { data } = await this.httpClient.get(url);
    return data;
  }
}
