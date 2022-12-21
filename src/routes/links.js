const express = require('express');
const { serializeUser } = require('passport');
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
    var existe = false;
    try {
        const duplicado = await pool.query('SELECT id_usuario, id_producto FROM cart WHERE id_usuario = ' + req.user.id_usuario + ' AND id_producto = ' + req.body.producto);
        if (duplicado[0].id_usuario == req.user.id_usuario) {
            existe = true;
        }
    } catch (error) {
        if (!existe) {
            await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
        }
    }
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
    var existe = false;
    try {
        const duplicado = await pool.query('SELECT id_usuario, id_producto FROM cart WHERE id_usuario = ' + req.user.id_usuario + ' AND id_producto = ' + req.body.producto);
        if (duplicado[0].id_usuario == req.user.id_usuario) {
            existe = true;
        }
    } catch (error) {
        if (!existe) {
            await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
        }
    } let productosHigiene = await pool.query('SELECT * FROM producto WHERE id_categoria = 2');
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
    var existe = false;
    try {
        const duplicado = await pool.query('SELECT id_usuario, id_producto FROM cart WHERE id_usuario = ' + req.user.id_usuario + ' AND id_producto = ' + req.body.producto);
        if (duplicado[0].id_usuario == req.user.id_usuario) {
            existe = true;
        }
    } catch (error) {
        if (!existe) {
            await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
        }
    } let productosHogar = await pool.query('SELECT * FROM producto WHERE id_categoria = 3');
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
    var existe = false;
    try {
        const duplicado = await pool.query('SELECT id_usuario, id_producto FROM cart WHERE id_usuario = ' + req.user.id_usuario + ' AND id_producto = ' + req.body.producto);
        if (duplicado[0].id_usuario == req.user.id_usuario) {
            existe = true;
        }
    } catch (error) {
        if (!existe) {
            await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
        }
    } let productosCosmetic = await pool.query('SELECT * FROM producto WHERE id_categoria = 4');
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
    var existe = false;
    try {
        const duplicado = await pool.query('SELECT id_usuario, id_producto FROM cart WHERE id_usuario = ' + req.user.id_usuario + ' AND id_producto = ' + req.body.producto);
        if (duplicado[0].id_usuario == req.user.id_usuario) {
            existe = true;
        }
    } catch (error) {
        if (!existe) {
            await pool.query('INSERT INTO cart (id_usuario, id_producto, precio_total) VALUES (' + req.user.id_usuario + ',' + req.body.producto + ',' + precio + ')');
        }
    } let productosComida = await pool.query('SELECT * FROM producto WHERE id_categoria = 5');
    productosComida = convertirPrecio(productosComida);
    res.render('links/comida', { productosComida });
});

// GET/POST CART
router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        let productos = await pool.query('SELECT c.id_carrito, p.id_producto, p.nombre_producto, c.cant_producto, c.precio_total, p.imagen_producto FROM cart c JOIN producto p ON c.id_producto = p.id_producto WHERE c.id_usuario = ' + req.user.id_usuario);
        productos = multiplicarPrecio(productos);
        let total = sumarPrecios(productos);
        productos.forEach(element => {
            element.precio_total = formatter.format(element.precio_total);
        });
        res.render('links/cart', { productos, total });
    } catch (error) {
        console.log(error);
        res.render('links/cart');
    }
});

router.post('/cart', isLoggedIn, async (req, res) => {
    try {
        const values = req.body.delete || req.body.suma || req.body.resta;
        if (values === 'delete') {
            await pool.query('DELETE FROM cart WHERE id_producto = ' + req.body.element + ' AND id_usuario = ' + req.user.id_usuario);
        } else if (values === 'suma') {
            await pool.query('UPDATE cart SET cant_producto = cant_producto + 1 WHERE id_producto = ' + req.body.element + ' AND id_usuario = ' + req.user.id_usuario);
        } else if (values === 'resta') {
            await pool.query('UPDATE cart SET cant_producto = cant_producto - 1 WHERE id_producto = ' + req.body.element + ' AND id_usuario = ' + req.user.id_usuario + ' AND cant_producto > 1');
        }
        let productos = await pool.query('SELECT c.id_carrito, p.id_producto, p.nombre_producto, c.cant_producto, c.precio_total, p.imagen_producto FROM cart c JOIN producto p ON c.id_producto = p.id_producto WHERE c.id_usuario = ' + req.user.id_usuario);
        productos = multiplicarPrecio(productos);
        let total = sumarPrecios(productos);
        productos.forEach(element => {
            element.precio_total = formatter.format(element.precio_total);
        });
        res.render('links/cart', { productos, total });
    } catch (error) {
        console.log(error);
        res.render('links/cart');
    }
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

function multiplicarPrecio(objeto) {
    objeto.forEach(element => {
        element.precio_total = (element.precio_total * element.cant_producto);
    });
    return objeto;
}

function sumarPrecios(objeto) {
    let total = 0;
    objeto.forEach(element => {
        total = (total + element.precio_total);
    });
    total = formatter.format(total);
    return total;
}

async function buscarProducto(id_producto) {
    const producto = await pool.query('SELECT * FROM producto WHERE id_producto = ' + id_producto);
    return producto;
}
module.exports = router;