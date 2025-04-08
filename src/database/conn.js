//const mysql = require ('mysql');
require('dotenv').config();

//const pool = mysql.createPool({
  //host: process.env.DB_HOST,
  //user: process.env.DB_USER,
  //password: process.env.DB_PASSWORD,
  //database: process.env.DB_DATABASE,
  //port: process.env.DB_PORT
//});

//module.exports = pool;
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário no Render
});

module.exports = pool;
