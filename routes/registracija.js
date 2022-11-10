const express = require('express');
const router = express.Router();
const db = require('../database');
const CryptoJS = require('crypto-js');

router.get('/', function(req, res) {
    res.render('registracija', {
        error: undefined
    });
});

router.post('/', async function(req, res) {
    let ime = req.body.ime;
    let lozinka = req.body.lozinka;
    const sql = "SELECT * FROM korisnici WHERE ime = '" + ime + "';";

    try {
        let korisnik = (await db.pool.query(sql, [])).rows[0];
        if(korisnik == undefined) {
            let loz = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(lozinka));
            const sql2 = "INSERT INTO korisnici(ime, lozinka) VALUES('" + ime + "', '" + loz + "')";
            await db.pool.query(sql2, []);
            
            req.session.user = ime;
            res.redirect("/");
        } else {
            res.render('registracija', {
                error: "Zauzeto"
            });
        }
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;