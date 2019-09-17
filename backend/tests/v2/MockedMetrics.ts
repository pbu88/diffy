import { Metrics } from '../../src/v2/Metrics';

export const metrics: Metrics = {
    diffStoredSuccessfully: jest.fn(),
    diffFailedToStore: jest.fn(),
    diffStoredSuccessfullyFromAPI: jest.fn(),
    diffFailedToStoreFromAPI: jest.fn(),
    diffDeletedSuccessfully: jest.fn(),
    diffFailedToDelete: jest.fn(),
    diffRetrievedSuccessfully: jest.fn(),
    diffLifetimeExtendedSuccessfully: jest.fn(),
};
