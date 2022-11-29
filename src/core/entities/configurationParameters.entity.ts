/* eslint-disable no-console */
import { IHttpClient } from '../../infra/externalInterfaces/httpClient/IHttpClient';
import { HttpClient, InternalServerError } from '../../infra/adaptors/index';

interface ILimitsParameters {
  sizeLimitInBytes: number;
  timeLimitInMs: number;
}

export class ConfigurationParameters implements ILimitsParameters {
  httpClient: IHttpClient;

  sizeLimitInBytes: number;

  timeLimitInMs: number;

  constructor() {
    this.sizeLimitInBytes = 1024 * 3;
    this.timeLimitInMs = 3 * 60000;
    this.httpClient = new HttpClient();
  }

  setLimits({ sizeLimitInBytes, timeLimitInMs }: ILimitsParameters) {
    this.sizeLimitInBytes = sizeLimitInBytes;
    this.timeLimitInMs = timeLimitInMs;
  }

  getLimits() {
    return {
      sizeLimit: this.sizeLimitInBytes,
      timeLimit: this.timeLimitInMs,
    };
  }

  async syncLimits() {
    try {
      const data = await this.httpClient.get('/limits');
      this.setLimits({
        sizeLimitInBytes: data.sizeLimit,
        timeLimitInMs: data.timeLimit,
      });
      return data;
    } catch (err) {
      throw new InternalServerError();
    }
  }
}
