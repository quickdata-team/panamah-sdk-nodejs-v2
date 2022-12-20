/* eslint-disable no-await-in-loop */
import {
  ConfigurationParameters,
  Storage,
  AuthenticationEntity,
  Logger,
  ApiServiceEntity,
  Mutex,
  IAuthenticationParameters,
} from '@entities';
import { ILimitsParameters } from '@infra';

type toBeSent = {
  data: {
    id: string;
    content: string;
  }[];
};

export class StreamingFlow {
  private streamingLoopIntervalMs = 1000; // Intervalo de envio do SDK para a API

  private refreshTokenLoopIntervalMs = 2000; // Intervalo de refresh de tokens

  private mutex: Mutex;

  private authenticationEntity: AuthenticationEntity;

  private configurationParameters: ConfigurationParameters;

  private apiServiceEntity = new ApiServiceEntity();

  constructor(
    mutex: Mutex,
    authenticationEntity: AuthenticationEntity,
    configurationParameters: ConfigurationParameters
  ) {
    this.mutex = mutex;
    this.authenticationEntity = authenticationEntity;
    this.configurationParameters = configurationParameters;
  }

  /**
   * Looping de streaming
   * @param {IAuthenticationParameters} {
   *     username,
   *     password,
   *   }
   * @return {*}  {Promise<void>}
   * @memberof StreamingFlow
   */
  public async init({
    username,
    password,
  }: IAuthenticationParameters): Promise<void> {
    try {
      this.mutex.setStatus({
        terminate: false,
        mutex: true,
      });
      await this.authenticationEntity.authenticate({
        username,
        password,
      });

      this.streamingLoop();
      this.refreshTokenLoop();
    } catch (error) {
      this.mutex.setStatus({ terminate: true });
      throw error;
    } finally {
      this.mutex.setStatus({ mutex: false });
    }
  }

  /**
   * Looping de streaming
   * @private
   * @memberof StreamingFlow
   */
  private streamingLoop(): void {
    setTimeout(async () => {
      try {
        if (this.mutex.getStatus().terminate) {
          return;
        }

        await this.mutex.checkForBlocking();

        this.mutex.blockStream();

        await this.sendBatch();
      } finally {
        this.mutex.unblock();
        if (this.mutex.isTerminated()) {
          this.streamingLoop();
        }
      }
    }, this.streamingLoopIntervalMs);
  }

  /**
   * Lógica de envio de arquivo
   * @private
   * @return {*}  {Promise<void>}
   * @memberof StreamingFlow
   */
  private async sendBatch(): Promise<void> {
    // Busca arquivos a serem enviados
    const fileNames = Storage.getFileList();

    // Verifica limites
    if (!this.anyLimitReached(fileNames)) {
      // Loga arquivos enviados
      StreamingFlow.logSentFiles([]);
      return;
    }

    // Cria e envia o arquivo
    const apiResponse = await this.sendJson(fileNames);

    // Loga arquivos enviados
    StreamingFlow.logSentFiles(fileNames);

    // Atualiza parametros
    this.configurationParameters.setLimits(apiResponse);

    // Deleta arquivos enviados
    StreamingFlow.cleanFilesSent(fileNames);
  }

  /**
   * Looping de refresh de token
   * @private
   * @memberof StreamingFlow
   */
  private refreshTokenLoop(): void {
    setTimeout(async () => {
      try {
        if (this.mutex.getStatus().terminate) {
          return;
        }

        await this.mutex.checkForBlocking();

        this.mutex.blockRefreshToken();

        await this.authenticationEntity.refreshTokens();
      } finally {
        this.mutex.unblock();
        if (this.mutex.isTerminated()) {
          this.refreshTokenLoop();
        }
      }
    }, this.refreshTokenLoopIntervalMs);
  }

  /**
   * Lógica de shutdown
   * @return {*}  {Promise<void>}
   * @memberof StreamingFlow
   */
  public async terminate(): Promise<void> {
    this.mutex.terminate();
    while (this.mutex.stillRunning()) {
      await this.mutex.checkForBlocking();
    }
    await this.sendBatch();
  }

  /**
   * Lógica de verificação se deve enviar o lote atual
   * @private
   * @param {string[]} fileNames
   * @return {*}  {boolean}
   * @memberof StreamingFlow
   */
  private anyLimitReached(fileNames: string[]): boolean {
    const folderSize = Storage.getFilesSize(fileNames);
    if (folderSize >= this.configurationParameters.sizeLimitInBytes) {
      return true;
    }
    return false;
  }

  /**
   * Envio de batch
   * @private
   * @param {string[]} fileNames
   * @return {*}
   * @memberof StreamingFlow
   */
  private async sendJson(fileNames: string[]): Promise<ILimitsParameters> {
    const postObj: toBeSent = {
      data: [],
    };
    for (const fileName of fileNames) {
      postObj.data.push({
        id: fileName,
        content: Storage.loadFile(fileName),
      });
    }
    const response = await this.apiServiceEntity.postSale(postObj);
    return response.newParameters;
  }

  /**
   * Log de arquivos enviados
   * @private
   * @static
   * @param {string[]} fileNames
   * @return {*}  {void}
   * @memberof StreamingFlow
   */
  private static logSentFiles(fileNames: string[]): void {
    if (fileNames.length === 0) {
      Logger.log('No files found to be sent');
      return;
    }

    for (const fileName of fileNames) {
      Logger.log(fileName);
    }
  }

  private static cleanFilesSent(fileNames: string[]): void {
    Storage.deleteFiles(fileNames);
  }
}
