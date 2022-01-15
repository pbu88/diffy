import { DeleteDiffInput } from 'diffy-models';
import { DeleteDiffOutput } from 'diffy-models';
import { ActionPromise } from 'diffy-models';
import { Context } from 'diffy-models';
import { Metrics } from '../metrics/Metrics';
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';

export class DeleteSharedDiffAction extends ActionPromise<DeleteDiffInput, Context, DeleteDiffOutput> {

  constructor(
      private repository: SharedDiffRepository,
      private metricsProvider: (gaCookie: string) => Metrics
    ) { super() }

  public execute(input: DeleteDiffInput, context: Context): Promise<DeleteDiffOutput> {
    const metrics = this.metricsProvider(context.gaCookie);
    return this.repository.deleteById(input.id).then(
      deletedRows => {
        metrics.diffDeletedSuccessfully();
        return new DeleteDiffOutput(true);
      },
      error => {
        console.log(error);
        metrics.diffFailedToDelete();
        return Promise.reject("There was an error when deleting the diff");
      });
  }
}
