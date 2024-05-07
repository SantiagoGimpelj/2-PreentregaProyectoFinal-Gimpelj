import mongoose from "mongoose";

const MessageCollection = "Message";
const MessageSchema = new mongoose.Schema({
    user:{type:String, required:[true, 'El nombre del usuario es obligatorio']},
    message:{type:String, required:[true, 'El mensaje es obligatorio']}
})

export const MessageModelo = mongoose.model(MessageCollection, MessageSchema);
