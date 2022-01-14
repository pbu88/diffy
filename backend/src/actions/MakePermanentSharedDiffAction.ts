import { Metrics } from '../metrics/Metrics';
import { makePermanent, extendLifetime } from '../SharedDiff';
import { ActionPromise, Context, MakeDiffPermanentInput, MakeDiffPermanentOutput, SharedDiff } from "diffy-models";
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';
import { GAMetrics } from '../metrics/GAMetrics';

export class MakePermanentSharedDiffAction extends ActionPromise<MakeDiffPermanentInput, Context, MakeDiffPermanentOutput> {
  static readonly MAX_LIFETIME_OF_DIFF_MS = 5 * 24 * 60 * 60 * 1000;  // 5 days

  constructor(private repository: SharedDiffRepository, private config: any) { super(); }

  execute(input: MakeDiffPermanentInput, context: Context): Promise<MakeDiffPermanentOutput> {
    const metrics =
      new GAMetrics(this.config.GA_ANALITYCS_KEY, context.gaCookie || this.config.GA_API_DEFAULT_KEY);
    return this.repository.fetchById(input.id)
      .then(diff => makePermanent(diff))
      .then(diff => this.repository.update(diff))
      .then(result => {
        metrics.diffMadePermanentSuccesfully();
        return new MakeDiffPermanentOutput(result);
      });
  }
}
