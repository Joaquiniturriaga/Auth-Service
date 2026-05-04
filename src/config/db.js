const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('./index');

const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false }
});

const initDb = async () => {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('DB lista');
};

initDb().catch(err => console.error('Error init DB:', err));

module.exports = pool;