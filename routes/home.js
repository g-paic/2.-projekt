const express = require('express');
const fs = require("fs");
const router = express.Router();
const db = require('../database');

router.get('/', async function(req, res, next) {
    const sql = "SELECT * FROM korisnici WHERE prijavljen = 'da';";
    try {
        let korisnik = (await db.pool.query(sql, [])).rows[0];
        let ime;
        if(korisnik == undefined) {
            ime = undefined;
        } else {
            ime = korisnik.ime;
        }

        const sql2 = "SELECT * FROM sigurnost";
        let s = (await db.pool.query(sql2, [])).rows[0];
        let sigurnost = s.vrijednost;

        res.render('home', {
            username: ime,
            sigurnost: sigurnost
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/odjava/:ime', async function(req, res) {
    let ime = req.params.ime;
    try {
        const sql = "UPDATE korisnici SET prijavljen = 'ne' WHERE ime = '" + ime + "';";
        await db.pool.query(sql, []);
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

router.post('/izbrisi/:ime', async function(req, res) {
    let ime = req.params.ime;
    try {
        const sql = "DELETE FROM korisnici WHERE ime = '" + ime + "';";
        await db.pool.query(sql, []);
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

router.get('/provjeri/:sigurnost', async function(req, res, next) {
    try {
        let sigurnost = req.params.sigurnost;
        let q = req.query.q;

        if(sigurnost == "da") {
            res.setHeader("Content-Security-Policy", "script-src http://localhost:4080")
        } else if(sigurnost == "ne") {
            res.removeHeader("Content-Security-Policy");
        }
        
        let ind = fs.readFileSync(__dirname + "/xssPage.ejs");
        ind = ind.toString().replace("<!-- provjeri -->", q);
        res.send(ind);
    } catch(err) {
        console.log(err);
    }
});

router.post('/', async function(req, res) {
    try {
        let sigurnost = req.body.sigurnost;

        const sql = "UPDATE sigurnost SET vrijednost = '" + sigurnost + "';";
        await db.pool.query(sql, []);
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;