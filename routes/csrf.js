const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async function(req, res, next) {
    try {
        const sql = "SELECT * FROM zastita_od_csrf";
        let s_csrf = (await db.pool.query(sql, [])).rows[0];
        let zastita_od_csrf = s_csrf.vrijednost;

        const sql2 = "SELECT * FROM korisnici WHERE prijavljen = 'da'";
        let korisnik = (await db.pool.query(sql2, [])).rows[0];

        let ime = undefined;
        if(korisnik != undefined) {
            ime = korisnik.ime
        }

        res.render('csrf', {
            username: ime,
            zastita_od_csrf: zastita_od_csrf
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/izbrisi', async function(req, res) {
    try {
        const sql = "SELECT * FROM zastita_od_csrf";
        let s_csrf = (await db.pool.query(sql, [])).rows[0];
        let zastita_od_csrf = s_csrf.vrijednost;

        if(zastita_od_csrf == "da") {
            const sql = "SELECT * FROM token WHERE port = " + req.socket.localPort;
            let user_token = (await db.pool.query(sql, [])).rows[0];
            let value = req.body.csrf_token;
            
            if(user_token.vrijednost != value) {
                res.redirect("/home");
            } else {
                const sql2 = "DELETE FROM korisnici WHERE prijavljen = 'da'";
                await db.pool.query(sql2, []);
                res.redirect('/home');
            }
        } else {
            const sql2 = "DELETE FROM korisnici WHERE prijavljen = 'da'";
            await db.pool.query(sql2, []);
            res.redirect('/home');
        }
    } catch(err) {
        console.log(err);
    }
});

router.get('/home', async function(req, res, next) {
    try {
        res.render('home3000');
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;