import { Router } from "express";
import ProductManager from "../dao/ProductManagerMemory.js";
import { productoModelo } from "../dao/models/productsModelo.js";
import ProductManagerMongo from "../dao/ProductManagerMongo.js";
import CartManager from "../dao/CartManagerMongo.js";

const productManager = new ProductManagerMongo();
const cartManager = new CartManager()
const router = Router();

// router.get('/', (req, res) => {
//     const p = new ProductManager()
//     const productos = p.getProducts()
//     return res.render('home', {productos})
// })

router.get("/", async(req, res) => {
    const productos = await productoModelo.find().lean();
    return res.render('home', {productos, styles:'styles.css', title: 'Home'})
})

router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts', {title: 'Real Time', styles:'styles.css'})
})

router.get("/chat", (req, res) => {
    return res.render('chat', {title:'Chat', styles:'styles.css'})
})


router.get('/products', async(req, res) => {
    const result = await productManager.getProducts(req, res);
    return res.render('products', {title:'Productos', result, styles: 'products.css' })
})

router.get('/cart/:cid', async (req, res) => {
    // const {cid} = req.params;
    const carrito = await cartManager.getCartById(req, res)
    return res.render('cart', {title:'Carrito', carrito, styles:'carts.css'})
})


export default router;