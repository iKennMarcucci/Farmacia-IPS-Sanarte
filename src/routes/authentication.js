const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get('/signup', (req, res) => {
    var nonavbar = true;
    res.render('auth/signup', { nonavbar });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', (req, res) => {

    res.send('PAGINA DE PERFIL');
});

module.exports = router;