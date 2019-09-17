import { SharedDiff }           from './SharedDiff';
import { SharedDiffRepository } from './SharedDiffRepository';
import { Metrics }              from './Metrics';

export class ExtendLifetimeSharedDiffAction {
    static readonly MAX_LIFETIME_OF_DIFF_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

    constructor(
            private repository: SharedDiffRepository,
            private metrics: Metrics) {}

    extendSharedDiffLifetime(diff_id: string, numberOfHours: number): Promise<SharedDiff> {
        return this.repository.fetchById(diff_id)
            .then(diff => {
                let newDate: Date = new Date(diff.expiresAt.getTime() + (numberOfHours * 60 * 60 * 1000));
                if(newDate.getTime() - diff.created.getTime() > ExtendLifetimeSharedDiffAction.MAX_LIFETIME_OF_DIFF_MS) {
                    return Promise.reject({
                        success: false,
                        message: "Can't extend beyond the maximum lifetime of a diff which is 5 days." +
                        " If this is needed, please fill a new issue on Github with the use case."
                    });
                }
            })
            .then(() => this.repository.extendLifetime(diff_id, numberOfHours))
            .then(
                result => { this.metrics.diffLifetimeExtendedSuccessfully(); return result; }
            );
    }
}
