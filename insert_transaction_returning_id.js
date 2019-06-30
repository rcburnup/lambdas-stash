const Pool = require('pg-pool');

// conn 
const pool = new Pool({
    host: process.env.DBHOST,
  	database: process.env.DBNAME,
 	user: process.env.DBUSER,
  	password: process.env.DBPASS,
 	port: process.env.DBPORT,
    max: 1,
    min: 0,
    idletimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});


module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const client = await pool.connect();
    
        
        let insertStatement = "INSERT INTO dev_insert_test(body) VALUES ($1) RETURNING test_id";
        let insertVals = ['Another inserted value.'];
        let resp = {
            isBase64Encoded: false
        }
        
        await client.query("BEGIN")
        .then(() => {
            return client.query(insertStatement, insertVals);
        })
        .then(res => {
            resp.body = res.rows[0];
            resp.statusCode = 200;
            return client.query("COMMIT");
        })
        .then(() => {
            client.release();
        })
        .catch(err => {
            resp.body = JSON.stringify(err);
            resp.statusCode = 500;
        });
        
        callback(null, resp);
}

