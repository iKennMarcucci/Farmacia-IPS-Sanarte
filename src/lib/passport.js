const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require("./helpers");

passport.use('local.signup', new LocalStrategy({
    usernameField: 'firstname',
    emailField: 'correo',
    passwordField: 'passwd',
    passReqToCallback: true
}, async (req, done) => {
    const { firstname, correo, passwd, lastname, tipo, cedula, direccion, confirmpasswd, genero } = req.body;
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
        // newUser.id = result.insertId;
        // return done(null, newUser);
    } else {
        console.log("CONTRASEÑAS NO COINCIDEN");
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE ID = ?', [id]);
    done(null, rows[0]);
});