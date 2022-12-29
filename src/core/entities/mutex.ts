/* eslint-disable no-await-in-loop */

type IRunningStatus = {
  mutexWaitMs: number; // Intervalo de espera em caso de operações bloqueantes
  streamingLoop: boolean; // Flag de running do streamingloop
  refreshTokenLoop: boolean; // Flag de running do refreshToken
  compress: boolean;
};
export class Mutex {
  private runningStatus: IRunningStatus = {
    mutexWaitMs: 1000,
    streamingLoop: false,
    refreshTokenLoop: false,
    compress: false,
  };

  public getStatus() {
    return this.runningStatus;
  }

  public setStatus(newRunningStatus: any) {
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

  public stillRunning(): boolean {
    const status = this.getStatus();
    return status.streamingLoop || status.refreshTokenLoop || status.compress;
  }

  public async checkForBlocking(): Promise<void> {
    while (this.stillRunning()) {
      await this.delay();
    }
  }

  public blockStream() {
    this.setStatus({
      streamingLoop: true,
    });
  }

  public unblockStream() {
    this.setStatus({
      streamingLoop: false,
    });
  }

  public blockRefreshToken() {
    this.setStatus({
      refreshTokenLoop: true,
    });
  }

  public unblockRefreshToken() {
    this.setStatus({
      refreshTokenLoop: false,
    });
  }

  public blockCompress() {
    this.setStatus({
      compress: true,
    });
  }

  public unblockCompress() {
    this.setStatus({
      compress: false,
    });
  }
}
