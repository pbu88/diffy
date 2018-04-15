import { makeSharedDiff } from '../../src/v2/SharedDiff';
import { MongoSharedDiffRepository } from '../../src/v2/SharedDiffRepository';

describe('MongoSharedDiff tests', () => {
    let repo: MongoSharedDiffRepository = null;
    beforeEach(() => {
        const url = 'mongodb://localhost:27017';
        const db_name = 'test';
        repo = new MongoSharedDiffRepository(url, db_name);
        repo.connect();
    });

    afterEach(() => {
        repo.disconnect();
    });

    test('Mongo test: store a SharedDiff', () => {
        const raw_diff = `
            diff --git a/file.json b/file.json
            index 1456e89..e1da2da 100644
            --- a/file.json
            +++ b/file.json
            @@ -1,1 +1,1 @@
            -a
            +b
            `
        const shared_diff = makeSharedDiff(raw_diff);
        expect(repo).toBeDefined();
        return repo.insert(shared_diff)
            .then(stored_diff => expect(stored_diff.id).toBeDefined());
    });

    test('Mongo test: fetch a SharedDiff', () => {
        const raw_diff = `
            diff --git a/file.json b/file.json
            index 1456e89..e1da2da 100644
            --- a/file.json
            +++ b/file.json
            @@ -1,1 +1,1 @@
            -a
            +b
            `
        const shared_diff = makeSharedDiff(raw_diff);
        return repo.insert(shared_diff)
            .then(stored_diff => repo.fetchById(stored_diff.id))
            .then(shared_diff => expect(shared_diff.id).toBeDefined());
    });

    test('Mongo test: delete a SharedDiff', () => {
        const raw_diff = `
            diff --git a/file.json b/file.json
            index 1456e89..e1da2da 100644
            --- a/file.json
            +++ b/file.json
            @@ -1,1 +1,1 @@
            -a
            +b
            `
        const shared_diff = makeSharedDiff(raw_diff);
        return repo.insert(shared_diff)
            .then(stored_diff => repo.deleteById(stored_diff.id))
            .then(deletedCount => expect(deletedCount).toEqual(1));
    });
});
