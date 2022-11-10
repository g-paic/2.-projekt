const {Pool} = require('pg');
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
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
    port numeric NOT NULL UNIQUE,
    vrijednost text NOT NULL
)`;

const sql_insert_token = `INSERT INTO token(port, vrijednost) VALUES
    ('4080', '220767bd72cb7b69823772573e852127'),
    ('3000', 'CIwNZNlR4XbisJF39I8yWnWX9wX4WFoz')
`;

const sql_drop_safety_xss = 'DROP TABLE IF EXISTS zastita_od_xss';

const sql_create_safety_xss = `CREATE TABLE zastita_od_xss(
    vrijednost text NOT NULL
)`;

const sql_insert_safety_xss = `INSERT INTO zastita_od_xss(vrijednost) VALUES
    ('ne')
`;

const sql_drop_safety_csrf = 'DROP TABLE IF EXISTS zastita_od_csrf';

const sql_create_safety_csrf = `CREATE TABLE zastita_od_csrf(
    vrijednost text NOT NULL
)`;

const sql_insert_safety_csrf = `INSERT INTO zastita_od_csrf(vrijednost) VALUES
    ('ne')
`;

const sql1 = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'korisnici') AS exist;"
const sql2 = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'token') AS exist;"
const sql3 = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'zastita_od_xss') AS exist;"
const sql4 = "SELECT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'zastita_od_csrf') AS exist;"

pool.connect();

async function make() {
    let rez = await pool.query(sql1, []);
    let exist = rez.rows[0].exist;

    let rez2 = await pool.query(sql2, []);
    let exist2 = rez2.rows[0].exist;

    let rez3 = await pool.query(sql3, []);
    let exist3 = rez3.rows[0].exist;

    let rez4 = await pool.query(sql4, []);
    let exist4 = rez4.rows[0].exist;

    if(exist == false || exist2 == false || exist3 == false || exist4 == false) {
        await pool.query(sql_drop, []);
        await pool.query(sql_create, []);

        await pool.query(sql_drop_token, []);
        await pool.query(sql_create_token, []);
        await pool.query(sql_insert_token, []);

        await pool.query(sql_drop_safety_xss, []);
        await pool.query(sql_create_safety_xss, []);
        await pool.query(sql_insert_safety_xss, []);

        await pool.query(sql_drop_safety_csrf, []);
        await pool.query(sql_create_safety_csrf, []);
        await pool.query(sql_insert_safety_csrf, []);
    }
}

module.exports = {
    pool: pool,
    make: make
}