/* eslint-disable no-await-in-loop */

type IRunningStatus = {
  terminate?: boolean; // Force stop flag
  mutex?: boolean; // Se esta sendo executado uma operação bloqueante
  mutexWaitMs?: number; // Intervalo de espera em caso de operações bloqueantes
  streamingLoop?: boolean; // Flag de running do streamingloop
  streamingLoopIntervalMs?: number; // Intervalo de envio do SDK para a API
  refreshTokenLoop?: boolean; // Flag de running do refreshToken
  refreshTokenLoopIntervalMs?: number;
};
export class Mutex {
  private runningStatus: IRunningStatus = {
    terminate: true, // Force stop flag
    mutex: false, // Se esta sendo executado uma operação bloqueante
    mutexWaitMs: 1000, // Intervalo de espera em caso de operações bloqueantes
    // streamingLoop: false, // Flag de running do streamingloop
    // streamingLoopIntervalMs: 1000, // Intervalo de envio do SDK para a API
    refreshTokenLoop: false, // Flag de running do refreshToken
    // refreshTokenLoopIntervalMs: 2000, // Intervalo de refresh de tokens
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

  public unblock() {
    this.setStatus({
      mutex: false,
      streamingLoop: false,
      refreshTokenLoop: false,
    });
  }

  public blockStream() {
    this.setStatus({
      mutex: true,
      streamingLoop: true,
    });
  }

  public blockRefreshToken() {
    this.setStatus({
      mutex: true,
      refreshTokenLoop: true,
    });
  }

  public terminate() {
    this.setStatus({ terminate: true });
  }

  public stillRunning() {
    return this.getStatus().streamingLoop || this.getStatus().refreshTokenLoop;
  }

  public isTerminated() {
    return !this.runningStatus.terminate;
  }
}
