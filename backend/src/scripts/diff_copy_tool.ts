import mongodb = require('mongodb');
import { buildDbUrl, MongoSharedDiffRepository } from "../sharedDiffRepository/MongoSharedDiffRepository";
import { GoogleDatastoreDiffRepository } from "../sharedDiffRepository/GoogleDatastoreDiffRepository";
import { Datastore } from "@google-cloud/datastore";
import * as readline from 'readline';

const db_host = '127.0.0.1';
const db_port = '27017';
const db_url = buildDbUrl(db_host, db_port);
const collection = mongodb.MongoClient.connect(db_url)
  .then(client => client.db(db_name))
  .then(db => db.collection(MongoSharedDiffRepository.COLLECTION_NAME));

const db_name = "diffy";
const ds = new Datastore();

const srcRepo = new MongoSharedDiffRepository(collection);
const dstRepo = new GoogleDatastoreDiffRepository(ds);

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