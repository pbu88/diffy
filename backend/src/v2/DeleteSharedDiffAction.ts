import {Metrics} from './Metrics';
import {SharedDiffRepository} from './SharedDiffRepository';

export class DeleteSharedDiffAction {
  repository: SharedDiffRepository;
  metrics: Metrics;

  constructor(repository: SharedDiffRepository, metrics: Metrics) {
    this.repository = repository;
    this.metrics = metrics;
  }

  deleteSharedDiff(diff_id: string): Promise<number> {
    return this.repository.deleteById(diff_id).then(
        deletedRows => {
          this.metrics.diffDeletedSuccessfully();
          return deletedRows
        },
        error => {
          this.metrics.diffFailedToDelete();
          return error
        })
  }
}
