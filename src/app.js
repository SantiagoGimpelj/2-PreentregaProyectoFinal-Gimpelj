import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import views from "./routes/views.js"
import __dirname from "./utils.js";
import ProductManager from "./dao/ProductManagerMemory.js";
import { productoModelo } from "./dao/models/productsModelo.js";
import { MessageModelo } from "./dao/models/messagesModelo.js";

const app = express();
const PORT = 8080;

const p = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// app.get("/", (req, res) => {
//   return res.render("home");
// });

app.use("/", views);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const connDB = async() => {
  try {
    await mongoose.connect(
      "mongodb+srv://santigimpelj2002:codercoder@cluster0.gr4jh5j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName:"ecommerce"
      }
    )
    console.log("DB Online...!!!")
  } catch (error) {
    console.log("Error al conectar a DB", error.message)
  }
}

await connDB()


const expressServer = app.listen(PORT, () => {
  console.log(`Corriendo aplicacion en el puerto ${PORT}`);
});
const io = new Server(expressServer);

io.on('connection', async(socket) => {
  //productos

  // const productos = p.getProducts()
  const productos = await productoModelo.find()
  socket.emit('productos', productos);

  socket.on('agregarProducto', async(producto)=>{
    // const result = p.addProduct(producto);
    const newProduct = await productoModelo.create({...producto})
  if(newProduct){
    productos.push(newProduct)
    socket.emit('productos', productos);
    // socket.emit('productos', result.producto);
  }
  });

  //chat message
  const messages = await MessageModelo.find();
  socket.emit('message', messages);

  socket.on('message', async(data) => {
    const newMessage = await MessageModelo.create({...data});
    if(newMessage){
      const messages = await MessageModelo.find();
      io.emit('messageLogs', messages);
    }
  })

  socket.broadcast.emit('nuevo_user');
});


