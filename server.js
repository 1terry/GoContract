require("dotenv").config();
var ibmdb = require("ibm+db");

let connStr =
  "DATABASE=" +
  process.env.DB_DATABASE +
  ";HOSTNAME=" +
  process.env.DB_HOSTNAME +
  ";PORT=" +
  process.env.DB_PORT +
  ";PROTOCOL=TCPIP;UID=" +
  process.env.DB_UID +
  ";PWD=" +
  process.env.DB_PWD +
  ";";

// need a bunch of API methods to CRUD database

// opening db connection
ibmdb.open(connStr, function (err, conn) {
  if (err) {
    return response.json({ success: -1, message: err });
  }

  // making query commands or some shit
});
