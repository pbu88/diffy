import { Metrics } from '../metrics/Metrics';
import { makePermanent } from '../SharedDiff';
import { ActionPromise, Context, MakeDiffPermanentInput, MakeDiffPermanentOutput, SharedDiff } from "diffy-models";
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';

export class MakePermanentSharedDiffAction extends ActionPromise<MakeDiffPermanentInput, Context, MakeDiffPermanentOutput> {
  static readonly MAX_LIFETIME_OF_DIFF_MS = 5 * 24 * 60 * 60 * 1000;  // 5 days

  constructor(
      private repository: SharedDiffRepository,
      private metricsProvider: (gaCookie: string) => Metrics
    ) { super(); }

  execute(input: MakeDiffPermanentInput, context: Context): Promise<MakeDiffPermanentOutput> {
    const metrics = this.metricsProvider(context.gaCookie);
    return this.repository.fetchById(input.id)
      .then(diff => makePermanent(diff))
      .then(diff => this.repository.update(diff))
      .then(result => {
        metrics.diffMadePermanentSuccesfully();
        return new MakeDiffPermanentOutput(result);
      });
  }
}
