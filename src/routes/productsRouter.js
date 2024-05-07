import { Router } from "express";
import ProductManagerMongo from "../dao/ProductManagerMongo.js";
// import ProductManager from "../dao/ProductManagerMemory.js";


const router = Router();
const productManager = new ProductManagerMongo();

router.get("/", async (req, res) => {
    try {
      const result = await productManager.getProducts(req, res);
      res.json(result);
    } catch (error) {
      console.log('Error en la solicitud GET de productos:', error);
      res.status(500).json({ msg: 'Error al obtener productos' });
    }
  });
  
  router.get("/:pid", async (req, res) => {
    try {
      const result = await productManager.getProductById(req, res);
      res.json(result);
    } catch (error) {
      console.log('Error en la solicitud GET de producto por ID:', error);
      res.status(500).json({ msg: 'Error al obtener producto por ID' });
    }
  });
  
  router.post("/", async (req, res) => {
    try {
      const result = await productManager.addProduct(req, res);
      res.json(result);
    } catch (error) {
      console.log('Error en la solicitud POST de agregar producto:', error);
      res.status(500).json({ msg: 'Error al agregar producto' });
    }
  });
  
  router.put("/:pid", async (req, res) => {
    try {
      const result = await productManager.updateProduct(req, res);
      res.json(result);
    } catch (error) {
      console.log('Error en la solicitud PUT de actualizar producto:', error);
      res.status(500).json({ msg: 'Error al actualizar producto' });
    }
  });
  
  router.delete("/:pid", async (req, res) => {
    try {
      const result = await productManager.deleteProduct(req, res);
      res.json(result);
    } catch (error) {
      console.log('Error en la solicitud DELETE de eliminar producto:', error);
      res.status(500).json({ msg: 'Error al eliminar producto' });
    }
  });


// router.get("/", (req, res) => {
//   const { limit } = req.query;
//   const p = new ProductManager();
//   return res.json({ Productos: p.getProducts(limit) });
// });

// router.get("/:pid", (req, res) => {
//   const { pid } = req.params;
//   const p = new ProductManager();
//   return res.json({ Producto: p.getProductById(Number(pid)) });
// });



// router.post("/", (req, res) => {
//     // const {title, description, price, thumbnails, code, stock, category, status} = req.body;
//     const p = new ProductManager();
//     const result = p.addProduct({...req.body});
//     // const result = p.addProduct(title, description, price, thumbnails, code, stock, category, status);
//     return res.json({result});
// })



// router.put("/:pid", (req, res) => {
//     const {pid} = req.params;
//     const p = new ProductManager();
//     const result = p.updateProduct(Number(pid), req.body);
//     return res.json({result});
// })


// router.delete("/:pid", (req, res) => {
//     const {pid} = req.params;
//     const p = new ProductManager();
//     const result = p.deleteProduct(Number(pid));
//     return res.json({result});
// })


export default router;



