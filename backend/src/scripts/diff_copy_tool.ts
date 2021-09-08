import { buildDbUrl, MongoSharedDiffRepository } from "../v2/SharedDiffRepository/MongoSharedDiffRepository";
import { GoogleDatastoreDiffRepository } from "../v2/SharedDiffRepository/GoogleDatastoreDiffRepository";
import { Datastore } from "@google-cloud/datastore";
import * as readline from 'readline';

const db_host = '127.0.0.1';
const db_port = '27017';
const db_url = buildDbUrl(db_host, db_port);
const db_name = "diffy";
const ds = new Datastore();

const srcRepo = new MongoSharedDiffRepository(db_url, db_name)
const dstRepo = new GoogleDatastoreDiffRepository(ds);

srcRepo.connect();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

rl.on('line', function(line){
    srcRepo.fetchById(line)
      .then(diff => dstRepo.update(diff))
      .then(diff => console.info(`Successfully copied ${diff.id}`))
      .catch(e => console.warn(`Failed to copy ${line} with error`, e))
})