/* eslint-disable no-await-in-loop */
import {
  ConfigurationParameters,
  Storage,
  AuthenticationEntity,
  Logger,
  ApiServiceEntity,
} from '@entities';
import { ILimitsParameters } from '@infra';

type toBeSent = {
  data: {
    id: string;
    content: string;
  }[];
};

export class StreamingFlow {
  private configurationParameters = new ConfigurationParameters();

  private authenticationEntity = new AuthenticationEntity();

  private apiServiceEntity = new ApiServiceEntity();

  private parameters!: ILimitsParameters;

  private runningStatus = {
    terminate: true, // Force stop flag
    mutex: false, // Se esta sendo executado uma operação bloqueante
    mutexWaitMs: 1000, // Intervalo de espera em caso de operações bloqueantes
    streamingLoop: false, // Flag de running do streamingloop
    streamingLoopIntervalMs: 1000, // Intervalo de envio do SDK para a API
    refreshTokenLoop: false, // Flag de running do refreshToken
    refreshTokenLoopIntervalMs: 2000, // Intervalo de refresh de tokens
  };

  public async init({ username, password }: any) {
    try {
      this.runningStatus = {
        ...this.runningStatus,
        terminate: false,
        mutex: true,
      };
      await this.authenticationEntity.authenticate({
        username,
        password,
      });

      this.streamingLoop();
      this.refreshTokenLoop();
    } catch (error) {
      this.runningStatus.terminate = true;
      throw error;
    } finally {
      this.runningStatus.mutex = false;
    }
  }

  private async delay(): Promise<void> {
    return new Promise((r) =>
      // eslint-disable-next-line no-promise-executor-return
      setTimeout(r, this.runningStatus.mutexWaitMs)
    );
  }

  private streamingLoop(): void {
    setTimeout(async () => {
      try {
        if (this.runningStatus.terminate) {
          return;
        }

        if (this.runningStatus.mutex) {
          await this.delay();
        }
        this.runningStatus = {
          ...this.runningStatus,
          mutex: true,
          streamingLoop: true,
        };

        // Busca limites
        this.parameters = this.getConfigParams();

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
        this.setConfigParams(apiResponse);

        // Deleta arquivos enviados
        StreamingFlow.cleanFilesSent(fileNames);
      } finally {
        this.runningStatus = {
          ...this.runningStatus,
          mutex: false,
          streamingLoop: false,
        };

        if (!this.runningStatus.terminate) {
          this.streamingLoop();
        }
      }
    }, this.runningStatus.streamingLoopIntervalMs);
  }

  private refreshTokenLoop(): void {
    setTimeout(async () => {
      try {
        if (this.runningStatus.terminate) {
          return;
        }

        if (this.runningStatus.mutex) {
          await this.delay();
        }

        this.runningStatus = {
          ...this.runningStatus,
          mutex: true,
          refreshTokenLoop: true,
        };
        await this.authenticationEntity.refreshTokens();
      } finally {
        this.runningStatus = {
          ...this.runningStatus,
          mutex: false,
          refreshTokenLoop: false,
        };

        if (!this.runningStatus.terminate) {
          this.streamingLoop();
        }
      }
    }, this.runningStatus.refreshTokenLoopIntervalMs);
  }

  public async checkForBlocking() {
    while (this.runningStatus.mutex) {
      await this.delay();
    }
  }

  public async terminate() {
    this.runningStatus.terminate = true;
    while (
      this.runningStatus.streamingLoop ||
      this.runningStatus.refreshTokenLoop
    ) {
      await this.delay();
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

  public getConfigParams(): ILimitsParameters {
    return this.configurationParameters.getLimits();
  }

  public setConfigParams(newParameters: ILimitsParameters) {
    this.configurationParameters.setLimits(newParameters);
  }

  public isAuthenticated() {
    return this.authenticationEntity.isAuthenticated();
  }
}
