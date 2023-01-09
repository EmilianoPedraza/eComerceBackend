
import mongoose from "mongoose";
import { Schema } from "mongoose";

const nameCollection = "carrito"
const schemaCollection = new Schema({
    tiemstamp:{type: Number},
    productos: [{
        id:{type:String, unique:true},
        nombre: {type:String},
        descripcion: {type:String},
        tiemstamp: {type:Number},
        codigo: {type:String, unique:true},
        precio: {type:Number},
        stock: {type:Number},
        foto: {type:String}
    }]
})
export const esquemaCarrito = schemaCollection
export const carrito =  mongoose.model(nameCollection, schemaCollection)
