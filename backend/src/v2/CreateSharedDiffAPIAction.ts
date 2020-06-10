import {CreateSharedDiffAction} from './CreateSharedDiffAction';

export class CreateSharedDiffAPIAction extends CreateSharedDiffAction {
  protected registerSuccessfulCreation() {
    this.metrics.diffStoredSuccessfullyFromAPI();
  }
  protected registerFailedCreation() {
    this.metrics.diffFailedToStoreFromAPI();
  }
}
