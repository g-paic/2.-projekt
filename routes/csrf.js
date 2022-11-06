const express = require('express');
const fs = require("fs");
const router = express.Router();
const openidConnect = require("express-openid-connect");
const dotenv = require("dotenv");
const db = require('../database');

router.get('/:ime', async function(req, res, next) {
    try {
        //console.log(req.baseUrl);
        let ime = req.params.ime;

        res.render('csrf', {
            username: ime
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/izbrisi/:ime', async function(req, res) {
    let ime = req.params.ime;
    try {
        const sql = "SELECT * FROM sigurnost";
        let s = (await db.pool.query(sql, [])).rows[0];
        let sigurnost = s.vrijednost;

        if(sigurnost == "da") {
            const sql = "SELECT * FROM token WHERE url = '" + req.baseUrl + "';";
            let user_token = (await db.pool.query(sql, [])).rows[0];
            console.log(user_token);
            let value = req.body.csrf_token;
            
            if(user_token.vrijednost != value) {
                res.redirect("/");
            } else {
                const sql2 = "DELETE FROM korisnici WHERE ime = '" + ime + "';";
                await db.pool.query(sql2, []);
                res.redirect("/");
            }
        } else {
            const sql2 = "DELETE FROM korisnici WHERE ime = '" + ime + "';";
            await db.pool.query(sql2, []);
            res.redirect("/");
        }
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;