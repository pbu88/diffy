import { Metrics } from '../metrics/Metrics';
import { extendLifetime, lifetimeExtensionCount } from '../SharedDiff';
import { ActionPromise, Context, ExtendDiffLifetimeInput, ExtendDiffLifetimeOutput, SharedDiff } from "diffy-models";
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';

export class ExtendLifetimeSharedDiffAction extends ActionPromise<ExtendDiffLifetimeInput, Context, ExtendDiffLifetimeOutput> {
  static readonly MAX_LIFETIME_OF_DIFF_MS = 5 * 24 * 60 * 60 * 1000;  // 5 days

  constructor(
    private repository: SharedDiffRepository,
    private metricsProvider: (gaCookie: string) => Metrics
  ) { super(); }

  execute(input: ExtendDiffLifetimeInput, context: Context): Promise<ExtendDiffLifetimeOutput> {
    const numberOfHours = 24;
    const metrics = this.metricsProvider(context.gaCookie);
    return this.repository.fetchById(input.id)
      .then(diff => {
        let newDate: Date = new Date(diff.expiresAt.getTime() + (numberOfHours * 60 * 60 * 1000));
        if (newDate.getTime() - diff.created.getTime() >
          ExtendLifetimeSharedDiffAction.MAX_LIFETIME_OF_DIFF_MS) {
          return Promise.reject({
            success: false,
            message: 'Can\'t extend beyond the maximum lifetime of a diff which is 5 days.' +
              ' If this is needed, please fill a new issue on Github with the use case.'
          });
        }
        return extendLifetime(diff, numberOfHours);
      })
      .then(diff => this.repository.update(diff))
      .then(diff => {
        const extensionsCount = lifetimeExtensionCount(diff);
        metrics.diffLifetimeExtendedSuccessfully(extensionsCount);
        return new ExtendDiffLifetimeOutput(diff);
      });
  }
}
