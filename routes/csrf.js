const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async function(req, res, next) {
    try {
        const sql = "SELECT * FROM zastita_od_csrf";
        let s_csrf = (await db.pool.query(sql, [])).rows[0];
        let zastita_od_csrf = s_csrf.vrijednost;

        res.render('csrf', {
            username: req.session.user,
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
                const sql2 = "DELETE FROM korisnici WHERE ime = '" + req.session.user + "';";
                await db.pool.query(sql2, []);

                req.session.user = undefined;
                req.session.destroy((err) => {
                    if(err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.redirect('/home');
                    }
                });
            }
        } else {
            const sql2 = "DELETE FROM korisnici WHERE ime = '" + req.session.user + "';";
            await db.pool.query(sql2, []);

            req.session.user = undefined;
            
            req.session.destroy((err) => {
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.redirect('/home');
                }
            });
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