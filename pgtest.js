const Pool = require('pg-pool');
const pool = new Pool({
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  port: process.env.DBPORT,
  max: 1,
  min: 0,
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 1000
});

module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let client;
  await pool.connect().then(c => {
    client = c;
    return client.query("select now()");
  }).then(res => {
    client.release();
    const response = {
      "isBase64Encoded": false,
      "statusCode": 200,
      "body": JSON.stringify(res.rows)
    }
    callback(null, response);
  }).catch(err => {
    console.log("ERR: ", err);
    const response = {
      "isBase64Encoded": false,
      "statusCode": 500,
      "body": JSON.stringify(err)
    } 
    callback(null, response);
  })
}