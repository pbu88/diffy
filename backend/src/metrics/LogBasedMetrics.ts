import {Metrics} from './Metrics';

export class LogBasedMetrics implements Metrics {
  constructor() {}
  private logStr(level: string, str: string) {
    if (level === 'info') {
      console.info('LogBasedMetrics: ' + str);
    } else if (level === 'error') {
      console.error('LogBasedMetrics: ' + str);
    }
  }
  diffStoredSuccessfully() {
    this.logStr('info', 'Diff stored successfully');
  }
  diffFailedToStore() {
    this.logStr('error', 'Diff failed to store');
  }
  diffStoredSuccessfullyFromAPI() {
    this.logStr('info', 'API: Diff stored successfully');
  }
  diffFailedToStoreFromAPI() {
    this.logStr('error', 'API: Diff failed to store');
  }
  diffDeletedSuccessfully() {
    this.logStr('info', 'Diff deleted successfully');
  }
  diffFailedToDelete() {
    this.logStr('error', 'Diff failed to delete');
  }
  diffRetrievedSuccessfully() {
    this.logStr('info', 'Diff retrieved successfully');
  }
  diffLifetimeExtendedSuccessfully(n: number) {
    this.logStr('info', `Diff lifetime extended successfully ${n} times`);
  }

  diffMadePermanentSuccesfully() {
    this.logStr('info', 'Diff made permanent successfully');
  }
}
