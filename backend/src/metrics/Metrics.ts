export interface Metrics {
  diffStoredSuccessfully: () => void;
  diffFailedToStore: () => void;
  diffStoredSuccessfullyFromAPI: () => void;
  diffFailedToStoreFromAPI: () => void;
  diffDeletedSuccessfully: () => void;
  diffFailedToDelete: () => void;
  diffRetrievedSuccessfully: () => void;
  /**
   * @param n: number of times the diff has been extended
   */
  diffLifetimeExtendedSuccessfully: (n: number) => void;
  diffMadePermanentSuccesfully: () => void;
}
