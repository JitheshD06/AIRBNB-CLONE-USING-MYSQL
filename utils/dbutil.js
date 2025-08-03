const sql = require("mysql2");

const pool = sql.createPool({
  host: "localhost",
  user: "root",
  password: "Jithu@2006",
  database: "airbnb",
});

module.exports = pool.promise();
