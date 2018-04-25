export interface Metrics {
    diffStoredSuccessfully: () => void;
    diffFailedToStore: () => void;
    diffDeletedSuccessfully: () => void;
    diffFailedToDelete: () => void;
}
