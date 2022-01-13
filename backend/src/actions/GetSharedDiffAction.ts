import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';
import { ActionPromise, Context, GetDiffInput, GetDiffOutput } from 'diffy-models';
import { GAMetrics } from '../metrics/GAMetrics';

export class GetSharedDiffAction extends ActionPromise<GetDiffInput, Context, GetDiffOutput> {
  constructor(private repository: SharedDiffRepository, private config: any) { super(); }

  execute(input: GetDiffInput, context: Context): Promise<GetDiffOutput> {
    const metrics =
      new GAMetrics(this.config.GA_ANALITYCS_KEY, context.gaCookie || this.config.GA_API_DEFAULT_KEY);
    return this.repository.fetchById(input.id).then(result => {
      metrics.diffRetrievedSuccessfully();
      return new GetDiffOutput(result);
    });
  }
}
