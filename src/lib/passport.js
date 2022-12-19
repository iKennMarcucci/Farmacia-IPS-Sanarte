const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require("./helpers");

passport.use('local.login', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'passwd',
    passReqToCallback: true
}, async (req, correo, passwd, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE email_usuario = ?', [correo]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(passwd, user.password_usuario);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.nombre_usuario));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The Username does not exists'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'firstname',
    passwordField: 'passwd',
    passReqToCallback: true
}, async (req, firstname, passwd, done) => {
    const { correo, lastname, tipo, cedula, direccion, confirmpasswd, genero } = req.body;
    if (passwd === confirmpasswd) {
        const newUser = {
            tipoid_usuario: tipo,
            cedula_usuario: cedula,
            nombre_usuario: firstname + " " + lastname,
            genero_usuario: genero,
            direccion_usuario: direccion,
            email_usuario: correo,
            password_usuario: passwd,
        }
        newUser.password_usuario = await helpers.encryptPassword(passwd);
        const resultado = await pool.query("INSERT INTO usuario SET ?", [newUser]);
        newUser.id = resultado.insertId;
        console.log(newUser);
        return done(null, newUser);
    } else {
        console.log("CONTRASEÑAS NO COINCIDEN");
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
    done(null, rows[0]);
});