export interface Metrics {
    diffStoredSuccessfully:          () => void;
    diffFailedToStore:               () => void;
    diffStoredSuccessfullyFromAPI:   () => void;
    diffFailedToStoreFromAPI:        () => void;
    diffDeletedSuccessfully:         () => void;
    diffFailedToDelete:              () => void;
    diffRetrievedSuccessfully:       () => void;
}
