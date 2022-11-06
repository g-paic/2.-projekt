const {Pool} = require('pg');
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'drugi_projekt_weba',
    password: process.env.DB_PASSWORD,
    port: 5432
});

const sql_drop = 'DROP TABLE IF EXISTS korisnici';

const sql_create = `CREATE TABLE korisnici(
    ime text NOT NULL UNIQUE,
    lozinka text NOT NULL,
    prijavljen text NOT NULL
)`;

const sql_drop_token = 'DROP TABLE IF EXISTS token';

const sql_create_token = `CREATE TABLE token(
    url text NOT NULL UNIQUE,
    vrijednost text NOT NULL
)`;

const sql_insert_token = `INSERT INTO token(url, vrijednost) VALUES
    ('/', '220767bd72cb7b69823772573e852127'),
    ('/csrf', 'CIwNZNlR4XbisJF39I8yWnWX9wX4WFoz')
`;

const sql_drop_safety = 'DROP TABLE IF EXISTS sigurnost';

const sql_create_safety = `CREATE TABLE sigurnost(
    vrijednost text NOT NULL
)`;

const sql_insert_safety = `INSERT INTO sigurnost(vrijednost) VALUES
    ('ne')
`;

const sql = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'korisnici') AS exist;"
const sql2 = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'token') AS exist;"
const sql3 = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'sigurnost') AS exist;"

pool.connect();

async function make() {
    let rez = await pool.query(sql, []);
    let exist = rez.rows[0].exist;

    let rez2 = await pool.query(sql2, []);
    let exist2 = rez2.rows[0].exist;

    let rez3 = await pool.query(sql3, []);
    let exist3 = rez3.rows[0].exist;

    if(exist == false || exist2 == false || exist3 == false) {
        await pool.query(sql_drop, []);
        await pool.query(sql_create, []);

        await pool.query(sql_drop_token, []);
        await pool.query(sql_create_token, []);
        await pool.query(sql_insert_token, []);

        await pool.query(sql_drop_safety, []);
        await pool.query(sql_create_safety, []);
        await pool.query(sql_insert_safety, []);
    }
}

module.exports = {
    pool: pool,
    make: make
}