import { request, response } from "express";
import { cartModelo } from "./models/cartsModelo.js";

export default class CartManager {
    async getCartById(req = request, res = response) {
        try {
            const { cid } = req.params;
            const carrito = await cartModelo.findById(cid).populate('products.id').lean();
            if (carrito) {
                // return res.json({ carrito })
                return carrito
            }
        return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        } catch (error) {
            console.log('getCartById -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async createCart(req = request, res = response) {
        try {
            const carrito = await cartModelo.create({})
            return res.json({ msg: 'Carrito creado', carrito })
        } catch (error) {
            console.log('createCart -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async addProductInCart(req = request, res = response) {
        try {
            const { cid, pid } = req.params;
            const carrito = await cartModelo.findById(cid);
            if (!carrito) {
                return res.status(404).json({ msg: `El carrito con id ${cid} no existe` })
            }
            const productoInCart = carrito.products.find(p => p.id.toString() === pid);
            if (productoInCart) {
                productoInCart.quantity++;
            } else {
                carrito.products.push({ id: pid, quantity: 1 })
            }
            carrito.save();

            return res.json({ msg: 'Carrito actualizado!', carrito });
        } catch (error) {
            console.log('addProductInCart -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async deleteProductsInCart(req = request, res = response) {
        try {
            const {cid, pid} = req.params;
            const carrito = await cartModelo.findByIdAndUpdate(cid, {$pull:{'products':{id:pid}}}, {new: true})
            if(!carrito){
                return res.status(404).json({msg:'No se pudo realizar la operacion'})
            }
            return res.json({msg:'Produto eleminado del carrito', carrito})
        } catch (error) {
            console.log('deleteProductsInCart -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            const carrito = await cartModelo.findByIdAndUpdate(cid, { products }, { new: true });
            if (!carrito) {
                return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
            }
            return res.json({ msg: 'Carrito actualizado', carrito });
        } catch (error) {
            console.log('updateCart -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' });
        }
    }

    async updateProductsInCart(req = request, res = response) {
        try {
            const {cid, pid} = req.params;
            const {quantity} = req.body;
            
            if(!quantity || !Number.isInteger(quantity)){
                return res.status(404).json({msg:'La propiedad quantity es obligatoria y debe ser un numero entero'})
            }
            const carrito = await cartModelo.findOneAndUpdate(
                { _id: cid, 'products.id': pid },
                { $set: {'products.$.quantity':quantity }},
                { new: true }
            );

            if(!carrito){
                return res.status(404).json({msg:'No se pudo realizar la operacion'})
            }
            return res.json({msg:'Produto actualizado en el carrito', carrito})
        } catch (error) {
            console.log('updateProductsInCart -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async deleteCart(req = request, res = response) {
        try {
            const {cid} = req.params;
            const carrito = await cartModelo.findByIdAndDelete(cid);
            if(!carrito){
                return res.status(404).json({msg:'No se pudo realizar la operacion'})
            }
            return res.json({msg:'Carrito eliminado en el carrito', carrito})
        } catch (error) {
            console.log('deleteCart -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }
}
