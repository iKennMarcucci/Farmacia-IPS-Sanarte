const express = require('express');
const { serializeUser, deserializeUser } = require('passport');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const formatter = new Intl.NumberFormat('en-US');

// GET/POST INDEX
router.get('/index', async (req, res) => {
    res.render('links/index');
});

router.post('/index', isLoggedIn, async (req, res) => {
    res.render('links/index');
});

// GET/POST SALUD
router.get('/salud', async (req, res) => {
    let productosSalud = await pool.query('SELECT * FROM producto WHERE id_categoria = 1');
    productosSalud = convertirPrecio(productosSalud);
    res.render('links/salud', { productosSalud });
});

router.post('/salud', isLoggedIn, async (req, res) => {
    const precio = normalizarPrecio(req.body.precio);
    await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
    let productosSalud = await pool.query('SELECT * FROM producto WHERE id_categoria = 1');
    productosSalud = convertirPrecio(productosSalud);
    res.render('links/salud', { productosSalud });
});

// GET/POST HIGIENE
router.get('/higiene', async (req, res) => {
    let productosHigiene = await pool.query('SELECT * FROM producto WHERE id_categoria = 2');
    productosHigiene = convertirPrecio(productosHigiene);
    res.render('links/higiene', { productosHigiene });
});

router.post('/higiene', isLoggedIn, async (req, res) => {
    const precio = normalizarPrecio(req.body.precio);
    await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
    let productosHigiene = await pool.query('SELECT * FROM producto WHERE id_categoria = 2');
    productosHigiene = convertirPrecio(productosHigiene);
    res.render('links/higiene', { productosHigiene });
});

// GET/POST HOGAR
router.get('/hogar', async (req, res) => {
    let productosHogar = await pool.query('SELECT * FROM producto WHERE id_categoria = 3');
    productosHogar = convertirPrecio(productosHogar);
    res.render('links/hogar', { productosHogar });
});

router.post('/hogar', isLoggedIn, async (req, res) => {
    const precio = normalizarPrecio(req.body.precio);
    await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
    let productosHogar = await pool.query('SELECT * FROM producto WHERE id_categoria = 3');
    productosHogar = convertirPrecio(productosHogar);
    res.render('links/hogar', { productosHogar });
});

// GET/POST COSMETICOS
router.get('/cosmetic', async (req, res) => {
    let productosCosmetic = await pool.query('SELECT * FROM producto WHERE id_categoria = 4');
    productosCosmetic = convertirPrecio(productosCosmetic);
    res.render('links/cosmetic', { productosCosmetic });
});

router.post('/cosmetic', isLoggedIn, async (req, res) => {
    const precio = normalizarPrecio(req.body.precio);
    await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
    let productosCosmetic = await pool.query('SELECT * FROM producto WHERE id_categoria = 4');
    productosCosmetic = convertirPrecio(productosCosmetic);
    res.render('links/cosmetic', { productosCosmetic });
});

// GET/POST COMIDA Y BEBIDA
router.get('/comida', async (req, res) => {
    let productosComida = await pool.query('SELECT * FROM producto WHERE id_categoria = 5');
    productosComida = convertirPrecio(productosComida);
    res.render('links/comida', { productosComida });
});

router.post('/comida', isLoggedIn, async (req, res) => {
    const precio = normalizarPrecio(req.body.precio);
    await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
    let productosComida = await pool.query('SELECT * FROM producto WHERE id_categoria = 5');
    productosComida = convertirPrecio(productosComida);
    res.render('links/comida', { productosComida });
});

// GET/POST CART
router.get('/cart', isLoggedIn, async (req, res) => {
    res.render('links/cart');
});

router.post('/cart', isLoggedIn, (req, res) => {
    res.render('links/cart');
});

router.post('/search', async (req, res) => {
    const { nombre } = req.body;
    if (nombre != "") {
        const producto = await pool.query("SELECT * FROM producto WHERE nombre_producto REGEXP ?", nombre);
        const filtro = nombre;
        res.render("links/search", { producto, filtro });
    }
});

function convertirPrecio(objeto) {
    objeto.forEach(element => {
        element.precio_producto = formatter.format(element.precio_producto);
    });
    return objeto;
}

function normalizarPrecio(precio) {
    precio = precio.replace(",", "")
    return precio;
}

async function buscarProducto(id_producto) {
    const producto = await pool.query('SELECT * FROM producto WHERE id_producto = ' + id_producto);
    return producto;
}
module.exports = router;