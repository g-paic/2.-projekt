const express = require('express');
const fs = require("fs");
const router = express.Router();
const db = require('../database');

router.get('/', async function(req, res, next) {
    try {
        const sql1 = "SELECT * FROM zastita_od_xss";
        let s_xss = (await db.pool.query(sql1, [])).rows[0];
        let zastita_od_xss = s_xss.vrijednost;

        let m = "";
        if(zastita_od_xss == "da") {
            m = "ONEMOGUĆENO";
        } else if(zastita_od_xss == "ne") {
            m = "OMOGUĆENO";
        }

        const sql2 = "SELECT * FROM zastita_od_csrf";
        let s_csrf = (await db.pool.query(sql2, [])).rows[0];
        let zastita_od_csrf = s_csrf.vrijednost;

        let n = "";
        if(zastita_od_csrf == "da") {
            n = "ONEMOGUĆENO";
        } else if(zastita_od_csrf == "ne") {
            n = "OMOGUĆENO";
        }

        res.render('home', {
            user: req.session.user,
            zastita_od_xss: zastita_od_xss,
            zastita_od_csrf: zastita_od_csrf,
            m: m,
            n: n
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/odjava', async function(req, res) {
    try {
        req.session.user = undefined;
        req.session.destroy((err) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.redirect('/');
            }
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/izbrisi', async function(req, res) {
    try {
        const sql = "DELETE FROM korisnici WHERE ime = '" + req.session.user + "';";
        await db.pool.query(sql, []);

        req.session.user = undefined;
        req.session.destroy((err) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.redirect('/');
            }
        });
    } catch(err) {
        console.log(err);
    }
});

router.get('/provjeri/:zastita_od_xss', async function(req, res, next) {
    try {
        let zastita_od_xss = req.params.zastita_od_xss;
        let q = req.query.q;

        if(zastita_od_xss == "da") {
            res.setHeader("Content-Security-Policy", "script-src http://localhost:4080")
        } else if(zastita_od_xss == "ne") {
            res.removeHeader("Content-Security-Policy");
        }
        
        let ind = fs.readFileSync(__dirname + "/xssPage.ejs");
        ind = ind.toString().replace("<!-- provjeri -->", q);
        res.send(ind);
    } catch(err) {
        console.log(err);
    }
});

router.post('/zastita_od_xss', async function(req, res) {
    try {
        let zastita_od_xss = req.body.zastita_od_xss;
        const sql = "UPDATE zastita_od_xss SET vrijednost = '" + zastita_od_xss + "';";
        await db.pool.query(sql, []);

        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

router.post('/zastita_od_csrf', async function(req, res) {
    try {
        let zastita_od_csrf = req.body.zastita_od_csrf;
        const sql = "UPDATE zastita_od_csrf SET vrijednost = '" + zastita_od_csrf + "';";
        await db.pool.query(sql, []);
        
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;