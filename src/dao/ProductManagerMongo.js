import { request, response } from "express";
import { productoModelo } from "./models/productsModelo.js";


export default class ProductManagerMongo {
    async getProducts(req = request, res = response) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            page = page == 0 ? 1 : page;
            page = Number(page);
            limit = Number(limit);
            const skip = (page - 1) * limit;
            const sortOrderOptions = { 'asc': -1, 'desc': 1 };
            sort = sortOrderOptions[sort] || null;

            try {
                if (query) {
                    query = JSON.parse(decodeURIComponent(query))
                }
            } catch (error) {
                console.log('Error al parsear:', error)
                query = {}
            }

            const queryProducts = productoModelo.find(query).limit(limit).skip(skip).lean();
            if (sort !== null) {
                queryProducts.sort({ price: sort });
            }
            const [productos, totalDocs] = await Promise.all([queryProducts, productoModelo.countDocuments(query)])

            const totalPage = Math.ceil(totalDocs / limit);
            const hastNextPage = page < totalPage;
            const hastPrevPage = page > 1;
            const prevPage = hastPrevPage ? page - 1 : null;
            const nextPage = hastNextPage ? page + 1 : null;

            const baseUrl = req.baseUrl;
            const prevLink = hastPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null;
            const nextLink = hastNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null;

            const result = {
                status: 'success/error',
                totalDocs,
                totalPage,
                limit,
                query,
                page,
                hastNextPage,
                hastPrevPage,
                prevPage,
                nextPage,
                prevLink,
                nextLink,
                payload: productos,
            }
            // return res.json({ result })
            // return res.render('products', { title: 'Productos', result });
            return result;
        } catch (error) {
            console.log('getProducts -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async getProductById(req = request, res = response) {
        try {
            const { pid } = req.params;
            const producto = await productoModelo.findById(pid);
            if (!producto) {
                return res.status(404).json({ msg: `Producto con id ${pid} no existe` })
            }
            return res.json({ producto })
        } catch (error) {
            console.log('getProductById -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async addProduct(req = request, res = response) {
        try {
            const { title, description, price, thumbnails, code, stock, category, status } = req.body;

            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(404).json({ msg: 'Los campos [title, description, code, price, stock, category] son obligatorios' })
            }
            const producto = await productoModelo.create({ title, description, price, thumbnails, code, stock, category, status });

            return res.json({ producto });
        } catch (error) {
            console.log('addProduct -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async deleteProduct(req = request, res = response) {
        try {
            const { pid } = req.params;
            const producto = await productoModelo.findByIdAndDelete(pid);
            if (producto) {
                return res.json({ msg: 'Producto eliminado', producto })
            }
            return res.status(404).json({ msg: `No se pudo eliminar el producto con id ${pid}` })
        } catch (error) {
            console.log('deleteProduct -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }

    async updateProduct(req = request, res = response) {
        try {
            const { pid } = req.params;
            const { id, ...rest } = req.body;
            const producto = await productoModelo.findByIdAndUpdate(pid, { ...rest }, { new: true });
            if (producto) {
                return res.json({ msg: 'Producto Actualizado', producto })
            }
            return res.status(404).json({ msg: `No se pudo actualizar el producto con id ${pid}` })
        } catch (error) {
            console.log('updateProduct -> ', error);
            return res.status(500).json({ msg: 'Hablar con un administrador' })
        }
    }
}
