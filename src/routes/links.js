const express = require('express');
const router = express.Router();
const pool = require('../database');
const path = require('path');

// GET/POST INDEX
router.get('/index', async (req, res) => {
    const productosSalud = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 1');
    const productosHigiene = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 2');
    const productosHogar = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 3');
    const productosCosmetic = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 4');
    const productosComida = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 5');

    console.log(productosSalud);

    res.render('links/index', { productosSalud, productosHigiene, productosHogar, productosCosmetic, productosComida });
});

router.post('/index', (req, res) => {
    res.render('links/index', {});
});

// GET/POST SALUD
router.get('/salud', async (req, res) => {
    const productosSalud = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 1');
    res.render('links/salud', { productosSalud });
});

router.post('/salud', (req, res) => {
    res.render('links/index');
});

// GET/POST HIGIENE
router.get('/higiene', async (req, res) => {
    const productosHigiene = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 2');
    res.render('links/higiene', { productosHigiene });
});

router.post('/higiene', (req, res) => {
    res.render('links/index');
});

// GET/POST HOGAR
router.get('/hogar', async (req, res) => {
    const productosHogar = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 3');
    res.render('links/hogar', { productosHogar });
});

router.post('/hogar', (req, res) => {
    res.render('links/index');
});

// GET/POST COSMETICOS
router.get('/cosmetic', async (req, res) => {
    const productosCosmetic = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 4');
    res.render('links/cosmetic', { productosCosmetic });
});

router.post('/cosmetic', (req, res) => {
    res.render('links/index');
});

// GET/POST COMIDA Y BEBIDA
router.get('/comida', async (req, res) => {
    const productosComida = await pool.query('SELECT id_producto, nombre_producto, dosis_producto, via_producto, id_categoria, inventario_producto, activo_producto, imagen_producto FROM producto WHERE id_categoria = 5');
    res.render('links/comida', { productosComida });
});

router.post('/comida', (req, res) => {
    res.render('links/index');
});

// GET/POST CART
router.get('/cart', async (req, res) => {
    res.render('links/cart');
});

router.post('/cart', (req, res) => {
    res.render('links/cart');
});
//usar flash MENSAJES DE ACEPTAICON
// router.post('/cart', (req, res) => {
//     .
//     .
//     .
//     req.flash('success', 'Link saved successfully');
// });

router.post('/search', async (req, res) => {
    const { nombre } = req.body;
    if (nombre != "") {
        const producto = await pool.query("SELECT * FROM producto WHERE nombre_producto REGEXP ?", nombre);
        const filtro = nombre;

        for (let i = 0; i < producto.length; i++) {
            var linkimg = '';
            if (producto[i].id_categoria == 1) {
                linkimg = producto[i].imagen_producto;
                producto[i].imagen_producto = '/img/imgSalud/' + linkimg;
            } else if (producto[i].id_categoria == 2) {
                linkimg = producto[i].imagen_producto;
                producto[i].imagen_producto = '/img/imgHigiene/' + linkimg;
            } else if (producto[i].id_categoria == 3) {
                linkimg = producto[i].imagen_producto;
                producto[i].imagen_producto = '/img/imgHogar/' + linkimg;
            } else if (producto[i].id_categoria == 4) {
                linkimg = producto[i].imagen_producto;
                producto[i].imagen_producto = '/img/imgCosmeticos/' + linkimg;
            } else if (producto[i].id_categoria == 5) {
                linkimg = producto[i].imagen_producto;
                producto[i].imagen_producto = '/img/imgComida/' + linkimg;
            }
        }
        res.render("links/search", { producto, filtro });
    }
});

module.exports = router;