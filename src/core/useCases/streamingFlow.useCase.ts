/* eslint-disable no-await-in-loop */
import {
  ConfigurationParameters,
  ILimitsParameters,
} from '../entities/configurationParameters.entity';
import { Storage } from '../entities/storage.entity';
import { AuthenticationEntity } from '../entities/authentication.entity';
import { Logger } from '../entities/Logger.entity';

type toBeSent = {
  data: {
    name: string;
    // size: number;
    content: string;
  }[];
};

export class StreamingFlow {
  private configurationParameters = new ConfigurationParameters();

  private authenticationEntity = new AuthenticationEntity();

  private parameters!: ILimitsParameters;

  private mutex = false; // Se esta sendo executado uma operação bloqueante

  private mutexWaitMs = 1000; // Intervalo de espera em caso de operações bloqueantes

  private streamingLoopIntervalMs = 1000; // Intervalo de envio do SDK para a API

  private refreshTokenLoopIntervalMs = 1000; // Intervalo de refresh de tokens

  private isRunning: boolean = false;

  public async init({ username, password }: any) {
    try {
      this.isRunning = true;
      this.mutex = true;
      await this.authenticationEntity.authenticate({
        username,
        password,
      });
      this.streamingLoop();
      // this.refreshTokenLoop();
    } catch (error) {
      this.isRunning = false;
      throw error;
    } finally {
      this.mutex = false;
    }
  }

  private async delay(): Promise<void> {
    return new Promise((r) =>
      // eslint-disable-next-line no-promise-executor-return
      setTimeout(r, this.mutexWaitMs)
    );
  }

  private streamingLoop(): void {
    setTimeout(async () => {
      // try {
      if (!this.isRunning) {
        return;
      }

      if (this.mutex) {
        await this.delay();
      }

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
      const apiResponse = StreamingFlow.sendJson(fileNames);

      // Loga arquivos enviados
      StreamingFlow.logSentFiles(fileNames);

      // Atualiza parametros
      this.setConfigParams(apiResponse);

      // Deleta arquivos enviados
      StreamingFlow.cleanFilesSent(fileNames);

      // Loop recursivo
      this.streamingLoop();
      // } finally {
      //   // Loop recursivo
      //   this.streamingLoop();
      // }
    }, this.streamingLoopIntervalMs);
  }

  private refreshTokenLoop(): void {
    setTimeout(async () => {
      // try {
      if (!this.isRunning) {
        return;
      }

      if (this.mutex) {
        await this.delay();
      }

      this.mutex = true;

      await this.authenticationEntity.refreshTokens();

      this.mutex = false;

      // Loop recursivo
      this.refreshTokenLoop();
      // } finally {
      //   // Loop recursivo
      //   this.streamingLoop();
      // }
    }, this.refreshTokenLoopIntervalMs);
  }

  public async checkForBlocking() {
    while (this.mutex) {
      await this.delay();
    }
  }

  public terminate() {
    this.isRunning = false;
  }

  private anyLimitReached(fileNames: string[]) {
    const folderSize = Storage.getFilesSize(fileNames);
    if (folderSize >= this.parameters.sizeLimitInBytes) {
      return true;
    }
    return false;
  }

  private static sendJson(fileNames: string[]) {
    const obj: toBeSent = {
      data: [],
    };
    for (const fileName of fileNames) {
      obj.data.push({
        name: fileName,
        // size: Storage.getFileSize(fileName),
        content: Storage.loadFile(fileName),
      });
    }

    return {
      sizeLimitInBytes: 200,
      timeLimitInMs: 200,
    };
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
