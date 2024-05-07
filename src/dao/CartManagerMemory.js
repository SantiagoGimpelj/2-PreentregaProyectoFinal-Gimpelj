import fs from "fs";
import ProductManager from "./ProductManagerMemory.js";

class CartsManager {
  static idProducto = 0;

  constructor() {
    this.path = "./src/data/carritos.json";
    this.carts = this.#leerCarritosInFile();
  }

  #asignarIdCart() {
    let id = 1;
    if (this.carts.length !== 0) {
      id = this.carts[this.carts.length - 1].id + 1;
    }
    return id;
  }

  #leerCarritosInFile() {
    try {
      if (fs.existsSync(this.path)) {
        return JSON.parse(fs.readFileSync(this.path, "utf-8"));
      }
      return [];
    } catch (error) {
      console.log(
        `ocuriro un error al momento de leer el archivo de productos, ${error}`
      );
    }
  }

  #guardarArchivo() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts));
    } catch (error) {
      console.log(error.message);
    }
  }

  createCart(){
    const newCart = {
        id: this.#asignarIdCart(),
        products: []
    };

    this.carts.push(newCart);
    this.#guardarArchivo();

    return newCart;
  }

  getCartById(id) {
    const producto = this.carts.find((prod) => prod.id == id);
    if (producto) {
      return producto;
    } else {
      return `Not Found del producto con id ${id}`;
    }
  }

  addProductInCart(cid, pid){
    
    let respuesta = `El carrito con id ${cid} no existe`;
    const indexCarrito = this.carts.findIndex(c => c.id === cid);

    if(indexCarrito !== -1){
        const indexProductoInCart = this.carts[indexCarrito].products.findIndex(p => p.id === pid);
        const p = new ProductManager();
        const producto = p.getProductById(pid);

        if(producto.status && indexProductoInCart === -1){
            this.carts[indexCarrito].products.push({ id: pid, "quantity": 1 });
            this.#guardarArchivo();
            respuesta="Productos agregado al carrito";
        }else if(producto.status && indexProductoInCart !== -1){
            ++this.carts[indexCarrito].products[indexProductoInCart].quantity;
            this.#guardarArchivo();this.#guardarArchivo();
            respuesta="Productos agregado al carrito";
        }
    }

    return respuesta;
}

}

export default CartsManager;
