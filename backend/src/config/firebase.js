var admin = require("firebase-admin");
const fs = require("fs");

var serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/serviceAccountKey.json")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
