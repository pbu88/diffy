import { DeleteDiffInput } from 'diffy-models';
import { DeleteDiffOutput } from 'diffy-models';
import { ActionPromise } from 'diffy-models';
import { Context } from 'diffy-models';
import { GAMetrics } from '../metrics/GAMetrics';
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';

export class DeleteSharedDiffAction extends ActionPromise<DeleteDiffInput, Context, DeleteDiffOutput> {

  constructor(
    private repository: SharedDiffRepository,
    private config: any) { super() }

  public execute(input: DeleteDiffInput, context: Context): Promise<DeleteDiffOutput> {
    const metrics =
      new GAMetrics(this.config.GA_ANALITYCS_KEY, context.gaCookie || this.config.GA_API_DEFAULT_KEY);
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
