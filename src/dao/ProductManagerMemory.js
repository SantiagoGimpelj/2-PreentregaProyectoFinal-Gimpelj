import fs from "fs";

class ProductManager {
  static idProducto = 0;

  constructor() {
    this.path = "./src/data/productos.json";
    this.products = this.#leerProducosInFile();
  }

  #asignarIdProducto() {
    let id = 1;
    if (this.products.length !== 0) {
      id = this.products[this.products.length - 1].id + 1;
    }
    return id;
  }

  #leerProducosInFile() {
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
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    } catch (error) {
      console.log(error.message);
    }
  }

  addProduct({title, description, price, thumbnails = [], code, stock, category, status = true}){

    let result = "Ocurrio un error";

    if (!title || !description || !price || !code || !stock || !category) {
      result = "Todos los parametros son requeridos [title, description, price, code, stock, category]";
    }else{
      const codeRepeat = this.products.some((prod) => prod.code == code);

      if (codeRepeat) {
        result = `El codigo ${code} ya se encuentra registrado en otro producto`;
      }else{
        ProductManager.idProducto = ProductManager.idProducto + 1;
        const id = this.#asignarIdProducto();
    
        const nuevoProducto = {
          id: id,
          title: title,
          description: description,
          price: price,
          thumbnails: thumbnails,
          code: code,
          stock: stock,
          category: category,
          status: status,
        };
        this.products.push(nuevoProducto);
        this.#guardarArchivo();
        result ={
          msg: "Producto agregado exitosamente",
          producto: nuevoProducto
        };
      }     
    }
    return result;
  }

  getProducts(limit = 0) {
    limit = Number(limit);
    if (limit > 0) {
      //devuelve la cantidad que piden
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    let status = false;
    let resp = `El productos id ${id} no existe`;

    const producto = this.products.find((prod) => prod.id == id);
    if (producto) {
      status=true;
      resp= producto
    } 
      return {status, resp}; 
  }

  updateProduct(id, objetcUpdate) {
    let msg = `El producto con id ${id} no existe`;

    const index = this.products.findIndex((prod) => prod.id === id);

    if (index !== -1) {
      const { id, ...rest } = objetcUpdate;
      this.products[index] = { ...this.products[index], ...rest };
      this.#guardarArchivo();
      msg = "Producto actualizado";
    }

    return msg;
  }

  deleteProduct(id) {
    let msg = `El producto con id ${id} no existe`;
    const index = this.products.findIndex((prod) => prod.id === id);
    if (index !== -1) {
      this.products = this.products.filter((prod) => prod.id !== id);
      this.#guardarArchivo();
      msg = `Producto Eliminado exitosamente!!`;
    }
    return msg;
  }
}

// module.exports = ProductManager;
export default ProductManager;
