const mysql = require("mysql");

// set up connection
const pool = mysql.createPool({
  connectionLimit: 10,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
});

async function asyncMySQL(query, variables) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        console.log("Error getting connection from pool:", error);
        reject(error);
        return;
      }
      console.log("Connected to the database!");
      connection.query(query, variables, (error, results) => {
        console.log("Query in asyncMySQL function:", query);
        console.log("variables in asyncMySQL function:", variables);
        connection.release();
        if (error) {
          console.log("Connection to server failed:", error);
          reject("mySQL error:", error);
        } else {
          console.log("Query successful:", results);
          resolve(results);
        }
      });
    });
  });
}

// test the connection
// async function test() {
//   const results = await asyncMySQL(`SELECT * FROM users;`);
//   console.log(results);
// }

// test();

// export connection
module.exports = asyncMySQL;
