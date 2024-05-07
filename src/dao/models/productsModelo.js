import mongoose from "mongoose";

const productoCollection = "Producto"
const productoSchema= new mongoose.Schema(
    {
        title:{type:String, require:[true, 'El titulo del producto es obligatorio']},
        description:{type:String, require:[true, 'La descripion del producto es obligatorio']},
        price:{type:Number, require:[true, 'El precio del producto es obligatorio']},
        thumbnails:[{type:String}],
        code:{type:String, require:[true, 'El codigo del producto es obligatorio']},
        stock:{type:Number, require:[true, 'El stock del producto es obligatorio']},
        category:{type:String, require:[true, 'La categoria del producto es obligatorio']},
        status:{type:Boolean, default: true},
    },
    {
        timestamps: true
    }
)

export const productoModelo = mongoose.model(
    productoCollection,
    productoSchema
)
