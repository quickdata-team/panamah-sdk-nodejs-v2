import {
  IHttpClient,
  HttpClient,
  InternalServerError,
  ILimitsParameters,
} from '@infra';

export class ConfigurationParameters implements ILimitsParameters {
  httpClient: IHttpClient;

  sizeLimitInBytes: number;

  timeLimitInMs: number;

  envelopMaxSize: number;

  constructor() {
    this.sizeLimitInBytes = 10000 * 5; // 50kb (media xml = 10kb)
    this.timeLimitInMs = 3 * 60000; // 3 minutos
    this.envelopMaxSize = 10; // Maximo de NFE's por envio
    this.httpClient = new HttpClient();
  }

  setLimits({
    sizeLimitInBytes,
    timeLimitInMs,
    envelopMaxSize,
  }: ILimitsParameters) {
    this.sizeLimitInBytes = sizeLimitInBytes;
    this.timeLimitInMs = timeLimitInMs;
    this.envelopMaxSize = envelopMaxSize;
  }

  getLimits(): ILimitsParameters {
    return {
      sizeLimitInBytes: this.sizeLimitInBytes,
      timeLimitInMs: this.timeLimitInMs,
      envelopMaxSize: this.envelopMaxSize,
    };
  }

  async syncLimits() {
    try {
      const data = await this.httpClient.get('/limits', '');
      this.setLimits({
        sizeLimitInBytes: data.sizeLimit,
        timeLimitInMs: data.timeLimit,
        envelopMaxSize: data.envelopMaxSize,
      });
      return data;
    } catch (err) {
      throw new InternalServerError();
    }
  }
}
