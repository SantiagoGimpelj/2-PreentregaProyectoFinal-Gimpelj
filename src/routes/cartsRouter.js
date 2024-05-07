import { Router } from "express";
// import CartsManager from "../dao/CartManagerMemory.js";
import CartManager from "../dao/CartManagerMongo.js";

const router = Router();
const cartManager = new CartManager();


router.get("/:cid",cartManager.getCartById);
router.post("/",cartManager.createCart);
router.post("/:cid/product/:pid",cartManager.addProductInCart);
router.delete('/:cid/products/:pid', cartManager.deleteProductsInCart);
router.put("/:cid", cartManager.updateCart);
router.put('/:cid/products/:pid', cartManager.updateProductsInCart);
router.delete('/:cid',cartManager.deleteCart);

// router.get("/:cid", (req, res) => {
//     const {cid} = req.params;
//     const c = new CartsManager();
//     const result = c.getCartById(Number(cid));
//     return res.json({result});
// })

// router.post("/", (req, res) => {
//     const c = new CartsManager();
//     const result = c.createCart();
//     return res.json({result});
// })

// router.post("/:cid/product/:pid", (req, res) => {
//     const {cid, pid} = req.params;
//     const c = new CartsManager();
//     const result = c.addProductInCart(Number(cid), Number(pid));
//     return res.json({result});
// })

export default router;
