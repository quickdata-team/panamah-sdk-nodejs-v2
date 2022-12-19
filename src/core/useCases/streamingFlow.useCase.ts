/* eslint-disable no-await-in-loop */
import {
  ConfigurationParameters,
  Storage,
  AuthenticationEntity,
  Logger,
  ApiServiceEntity,
  Mutex,
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

  private parameters!: ILimitsParameters;

  constructor(
    mutex: Mutex,
    authenticationEntity: AuthenticationEntity,
    configurationParameters: ConfigurationParameters
  ) {
    this.mutex = mutex;
    this.authenticationEntity = authenticationEntity;
    this.configurationParameters = configurationParameters;
  }

  public async init({ username, password }: any) {
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

  private streamingLoop(): void {
    setTimeout(async () => {
      try {
        if (this.mutex.getStatus().terminate) {
          return;
        }

        await this.mutex.checkForBlocking();

        this.mutex.blockStream();

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
      } finally {
        this.mutex.unblock();
        if (this.mutex.isTerminated()) {
          this.streamingLoop();
        }
      }
    }, this.streamingLoopIntervalMs);
  }

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

  public async terminate() {
    this.mutex.terminate();
    while (this.mutex.stillRunning()) {
      await this.mutex.checkForBlocking();
    }
  }

  private anyLimitReached(fileNames: string[]) {
    const folderSize = Storage.getFilesSize(fileNames);
    if (folderSize >= this.parameters.sizeLimitInBytes) {
      return true;
    }
    return false;
  }

  private async sendJson(fileNames: string[]) {
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

  private static logSentFiles(fileNames: string[]) {
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
