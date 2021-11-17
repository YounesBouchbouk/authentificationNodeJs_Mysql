const mysql = require("mysql")

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "toor",
  database: "prjdb"
});

module.exports = connection;