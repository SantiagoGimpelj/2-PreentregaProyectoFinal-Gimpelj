import mongoose from "mongoose";

const cartCollection = "Cart";
const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
        quantity:{
            type:Number,
            require:[true, 'La cantidad del producto es obligatoria']
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export const cartModelo = mongoose.model(cartCollection, cartSchema);
