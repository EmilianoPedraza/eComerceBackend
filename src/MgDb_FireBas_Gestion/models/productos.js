import mongoose from "mongoose"
import { Schema } from "mongoose"

const nameCollection = "productos"

const schemaCollection = new Schema({
    nombre: {type:String, require:true},
    descripcion: {type:String, require:true},
    tiemstamp: {type:Number, require:true},
    codigo: {type:String, unique:true, require:true},
    precio: {type:Number, require:true},
    stock: {type:Number, require:true},
    foto: {type:String, require:true}
})


export const esquema = schemaCollection
export const productoMong = mongoose.model(nameCollection, schemaCollection)
