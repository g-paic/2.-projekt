const express = require('express');
const router = express.Router();
const db = require('../database');
const CryptoJS = require('crypto-js');

router.get('/', function(req, res) {
    res.render('prijava', {
        error: undefined
    });
});

router.post('/', async function(req, res) {
    let ime = req.body.ime;
    let lozinka = req.body.lozinka;
    const sql = "SELECT * FROM korisnici WHERE ime = '" + ime + "';";

    try {
        let korisnik = (await db.pool.query(sql, [])).rows[0];
        
        if(korisnik != undefined) {
            if(ime == korisnik.ime) {
                let loz = CryptoJS.enc.Base64.parse(korisnik.lozinka).toString(CryptoJS.enc.Utf8);
                if(loz == lozinka) {
                    req.session.user = ime;
                    res.redirect("/");
                } else {
                    res.render('prijava', {
                        error: "Krivi podaci"
                    });
                }
            } else {
                res.render('prijava', {
                    error: "Krivi podaci"
                });
            }
        } else {
            res.render('prijava', {
                error: "Krivi podaci"
            });
        }
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;