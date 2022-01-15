import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';
import { ActionPromise, Context, GetDiffInput, GetDiffOutput } from 'diffy-models';
import { Metrics } from '../metrics/Metrics';

export class GetSharedDiffAction extends ActionPromise<GetDiffInput, Context, GetDiffOutput> {
  constructor(
      private repository: SharedDiffRepository,
      private metricsProvider: (gaCookie: string) => Metrics
    ) { super(); }

  execute(input: GetDiffInput, context: Context): Promise<GetDiffOutput> {
    const metrics = this.metricsProvider(context.gaCookie);
    return this.repository.fetchById(input.id).then(result => {
      metrics.diffRetrievedSuccessfully();
      return new GetDiffOutput(result);
    });
  }
}
