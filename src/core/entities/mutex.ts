/* eslint-disable no-await-in-loop */

type IRunningStatus = {
  terminate?: boolean; // Force stop flag
  mutex?: boolean; // Se esta sendo executado uma operação bloqueante
  mutexWaitMs?: number; // Intervalo de espera em caso de operações bloqueantes
  streamingLoop?: boolean; // Flag de running do streamingloop
  streamingLoopIntervalMs?: number; // Intervalo de envio do SDK para a API
  refreshTokenLoop?: boolean; // Flag de running do refreshToken
  refreshTokenLoopIntervalMs?: number;
  compress?: boolean;
};
export class Mutex {
  private runningStatus: IRunningStatus = {
    terminate: true, // Force stop flag
    mutex: false, // Se esta sendo executado uma operação bloqueante
    mutexWaitMs: 1000, // Intervalo de espera em caso de operações bloqueantes
    streamingLoop: false, // Flag de running do streamingloop
    refreshTokenLoop: false, // Flag de running do refreshToken
  };

  public getStatus() {
    return this.runningStatus;
  }

  public setStatus(newRunningStatus: IRunningStatus) {
    this.runningStatus = {
      ...this.runningStatus,
      ...newRunningStatus,
    };
  }

  private async delay(): Promise<void> {
    return new Promise((r) =>
      // eslint-disable-next-line no-promise-executor-return
      setTimeout(r, this.runningStatus.mutexWaitMs)
    );
  }

  public async checkForBlocking(): Promise<void> {
    while (this.runningStatus.mutex) {
      await this.delay();
    }
  }

  public blockStream() {
    this.setStatus({
      mutex: true,
      streamingLoop: true,
    });
  }

  public unblockStream() {
    this.setStatus({
      mutex: false,
      streamingLoop: false,
    });
  }

  public blockRefreshToken() {
    this.setStatus({
      mutex: true,
      refreshTokenLoop: true,
    });
  }

  public unblockRefreshToken() {
    this.setStatus({
      mutex: false,
      refreshTokenLoop: false,
    });
  }

  public blockCompress() {
    this.setStatus({
      mutex: true,
      compress: true,
    });
  }

  public unblockCompress() {
    this.setStatus({
      mutex: false,
      compress: false,
    });
  }

  public terminate() {
    this.setStatus({ terminate: true });
  }

  public stillRunning() {
    const status = this.getStatus();
    return status.streamingLoop || status.refreshTokenLoop || status.compress;
  }

  public isNotTerminated() {
    return !this.runningStatus.terminate;
  }
}
