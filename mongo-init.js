db = db.getSiblingDB('interview-insight');
db.createCollection('dummy');
db.dummy.insertOne({ initialized: true });
