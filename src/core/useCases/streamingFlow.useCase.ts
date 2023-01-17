/* eslint-disable no-await-in-loop */
import {
  ConfigurationParameters,
  Storage,
  AuthenticationEntity,
  Logger,
  ApiServiceEntity,
  Mutex,
  IAuthenticationParameters,
  Xml,
} from '@entities';
import { ILimitsParameters } from '@infra';

interface IStatusProcessedFiles {
  sentFiles: {
    dir: string;
    files: string[];
    count: number;
  };
  filesInProcess: {
    dir: string;
    files: string[];
    count: number;
  };
}

export class StreamingFlow {
  private streamingLoopIntervalMs = 1000; // Intervalo de envio do SDK para a API

  private streamingLoopId: any;

  private refreshTokenLoopIntervalMs = 1000; // Intervalo de refresh de tokens. 24h

  private refreshTokenLoopId: any;

  private mutex: Mutex;

  private authenticationEntity: AuthenticationEntity;

  private configurationParameters: ConfigurationParameters;

  private apiServiceEntity = new ApiServiceEntity();

  private xmlEntity = new Xml();

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
    await this.authenticationEntity.authenticate({
      username,
      password,
    });
    this.streamingLoop();
    this.refreshTokenLoop();
  }

  /**
   * Looping de streaming
   * @private
   * @memberof StreamingFlow
   */
  private streamingLoop(): void {
    this.streamingLoopId = setTimeout(async () => {
      try {
        await this.mutex.checkForBlocking();
        this.mutex.blockStream();
        await this.sendBatch(false);
      } finally {
        this.mutex.unblockStream();
        this.streamingLoop();
      }
    }, this.streamingLoopIntervalMs);
  }

  /**
   * Lógica de envio de arquivo
   * @private
   * @param {boolean} force Se deve forçar o envio do batch, mesmo que nao atinja um limite
   * @return {*}  {Promise<void>}
   * @memberof StreamingFlow
   */
  private async sendBatch(force: boolean): Promise<void> {
    // Busca arquivos a serem enviados
    let fileNames = Storage.getFileList();

    // Aplica limite de envio
    const maxLength = this.configurationParameters.getLimits().envelopMaxSize;

    if (fileNames.length > maxLength) {
      fileNames = fileNames.slice(0, maxLength);
    }

    // Verifica limites
    if (!this.anyLimitReached(fileNames, force)) {
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

    // Deleta arquivos acumulados e salva os arquivos enviados
    StreamingFlow.cleanAccumulatedFiles(fileNames);
  }

  /**
   * Looping de refresh de token
   * @private
   * @memberof StreamingFlow
   */
  private refreshTokenLoop(): void {
    this.refreshTokenLoopId = setTimeout(async () => {
      try {
        await this.mutex.checkForBlocking();
        this.mutex.blockRefreshToken();
        await this.authenticationEntity.refreshTokens(
          this.streamingLoopIntervalMs
        );
      } finally {
        this.mutex.unblockRefreshToken();
        this.refreshTokenLoop();
      }
    }, this.refreshTokenLoopIntervalMs);
  }

  /**
   * Lógica de shutdown
   * @return {*}  {Promise<void>}
   * @memberof StreamingFlow
   */
  public async terminate(): Promise<void> {
    while (this.mutex.stillRunning()) {
      await this.mutex.checkForBlocking();
    }

    clearTimeout(this.refreshTokenLoopId);
    clearTimeout(this.streamingLoopId);

    // Continua enviando ate nao haver mais arquivos para enviar
    while (Storage.getFileList().length > 0) {
      await this.sendBatch(true);
    }
  }

  /**
   * Lógica de verificação se deve enviar o lote atual
   * @private
   * @param {string[]} fileNames
   * @return {*}  {boolean}
   * @memberof StreamingFlow
   */
  private anyLimitReached(fileNames: string[], force: boolean): boolean {
    // Se nao houver nada para enviar, retorna
    if (fileNames.length === 0) {
      return false;
    }

    // Envio forçado por parada do SDK
    if (force) {
      return true;
    }

    // Limite de tamanho atingido
    const folderSize = Storage.getFilesSize(fileNames);
    if (folderSize >= this.configurationParameters.sizeLimitInBytes) {
      return true;
    }

    // Limite de tempo atingido
    const oldestFile = new Date().getTime() - Storage.getOldestFile(fileNames);
    if (oldestFile >= this.configurationParameters.timeLimitInMs) {
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
    // Envelope em JSON
    const emptyArray: any = [];
    const subscribersArray: any = [];
    const postObj: any = {
      envelop: {
        metaData: {
          timeStamp: new Date().toISOString(),
          nfeCount: fileNames.length,
          subscribers: {
            subscriber: [],
          },
          subscribersCount: 0,
        },
        NFES: {
          NFE: emptyArray,
        },
      },
    };

    // Adiciona XMLs ao envelope
    for (const fileName of fileNames) {
      // Busca XML
      const file = Storage.loadFile(fileName);
      // Tranforma o arquivo XML em json
      const json: any = this.xmlEntity.xml2json(file);

      // eslint-disable-next-line no-underscore-dangle
      delete json._declaration;

      // Busca e salva CNPJ
      const newSubcriber = Xml.getCnpj(json);
      if (!subscribersArray.includes(newSubcriber)) {
        subscribersArray.push(newSubcriber);
      }

      // Adiciona xml
      postObj.envelop.NFES.NFE.push(json);
    }

    // add meta dados:
    // Quantidade de assinantes distintos
    postObj.envelop.metaData.subscribersCount = subscribersArray.length;
    // Assinantes
    for (const newSubscriber of subscribersArray) {
      postObj.envelop.metaData.subscribers.subscriber.push(newSubscriber);
    }

    // Tranforma o envelope em XML
    const postXml = this.xmlEntity.json2xml(postObj);

    const response = await this.apiServiceEntity.postSale(
      postXml,
      this.authenticationEntity.getTokens().accessToken
    );
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

  private static cleanAccumulatedFiles(fileNames: string[]): void {
    Storage.deleteFiles(fileNames);
  }

  public static statusProcessedFiles(): IStatusProcessedFiles {
    // Arquivos enviados
    const sentFiles = Storage.getListSentFiles();

    // Arquivos em processamento
    const accumulatedFiles = Storage.getFileList();

    return {
      sentFiles: {
        dir: Storage.sentDirNfe,
        files: sentFiles,
        count: sentFiles.length,
      },
      filesInProcess: {
        dir: Storage.dirNfe,
        files: accumulatedFiles,
        count: accumulatedFiles.length,
      },
    };
  }
}
