import mongodb = require('mongodb');
import { makeSharedDiff } from '../../src/SharedDiff';
import { buildDbUrl, MongoSharedDiffRepository } from '../../src/sharedDiffRepository/MongoSharedDiffRepository';

const config = {
  type: "mongo",
  db_host: process.env.DIFFY_DB_HOST || '127.0.0.1',
  db_port: process.env.DIFFY_DB_PORT || '27017',
  db_name: 'diffy',
};
const db_url = buildDbUrl(config["db_host"], config["db_port"]);
const client = mongodb.MongoClient.connect(db_url);
const collection = client
  .then(client => client.db(config.db_name))
  .then(db => db.collection(MongoSharedDiffRepository.COLLECTION_NAME));

describe.skip('MongoSharedDiff tests', () => {
  let repo: MongoSharedDiffRepository = null;
  beforeEach(() => {
    const url = db_url;
    const db_name = 'test';
    repo = new MongoSharedDiffRepository(collection);
  });

  afterEach(() => {
    client.then(c => c.close());
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
    return repo.insert(shared_diff).then(stored_diff => {
      expect(stored_diff.id).toBeDefined()
      expect(stored_diff.rawDiff).toBeDefined()
      expect(stored_diff.diff).toBeDefined()
      expect(stored_diff.diff).toHaveLength(0) // apparently the parsed diff is empty
    });
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
      .then(shared_diff => {
        expect(shared_diff.id).toBeDefined()
        expect(shared_diff.rawDiff).toEqual(raw_diff);
      });
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
