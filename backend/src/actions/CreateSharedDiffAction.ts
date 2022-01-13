import { Metrics } from '../metrics/Metrics';
import { isValidRawDiff, makeSharedDiff } from '../SharedDiff';
import { SharedDiff } from "diffy-models";
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';
import { ActionPromise } from 'diffy-models';
import { Context } from 'diffy-models';
import { CreateDiffInput } from 'diffy-models';
import { GetDiffOutput } from 'diffy-models';
import { GAMetrics } from '../metrics/GAMetrics';

export class CreateSharedDiffAction extends ActionPromise<CreateDiffInput, Context, GetDiffOutput> {
  constructor(
    private repository: SharedDiffRepository,
    private config: any) {
    super();
  }

  public execute(input: CreateDiffInput, context: Context): Promise<GetDiffOutput> {
    const metrics =
      new GAMetrics(this.config.GA_ANALITYCS_KEY, context.gaCookie || this.config.GA_API_DEFAULT_KEY);
    if (!isValidRawDiff(input.diff)) {
      return Promise.reject("Diff is not valid");
    }
    const sharedDiff = makeSharedDiff(input.diff);
    return this.storeSharedDiff(sharedDiff, metrics).then((obj: SharedDiff) => {
      if (!obj.id) {
        console.warn('new: undefined obj id');
        return Promise.reject({ error: 'new: undefined obj id' });
      }
      return Promise.resolve(new GetDiffOutput(obj));
    });
  }

  private storeSharedDiff(shared_diff: SharedDiff, metrics: Metrics): Promise<SharedDiff> {
    return this.repository.insert(shared_diff)
      .then(
        shared_diff => {
          metrics.diffStoredSuccessfully();
          return shared_diff
        },
        error => {
          metrics.diffFailedToStore();
          return Promise.reject(error)
        })
  }
}
