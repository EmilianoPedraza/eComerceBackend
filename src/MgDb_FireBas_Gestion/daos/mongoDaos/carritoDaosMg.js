import { MongoGestion } from "../../mongoGestion.js";
import {carrito, esquemaCarrito} from "../../models/carrito.js"
import {esquema} from "../../models/productos.js"
export default class carritoDaosMg extends MongoGestion{
    constructor(){
        super(carrito)
        this.esqueProd = esquema
        this.esqueCar = esquemaCarrito
    }
    formatId = async(docs, varant)=>{
        const schemaCamps = varant === undefined? {...this.esqueCar.obj, _id:true,id:true} : {...this.esqueProd.obj, _id:true,id:true}
        const dcNw = {}
        if(docs!==[]){
          const doc = varant === undefined ? docs[0] : docs
          for (const key in schemaCamps)
          {doc[`${key}`] !== undefined && (dcNw[`${key}`] = doc[`${key}`])}
        }
        return dcNw
      }

    apushProdIdCar = async (id, prod)=>{
        const producto = prod
        await this.schema.updateOne({_id: id},{
            $push: {
                'productos': producto
            }
        })
    }
    deleteProdIdCar = async(id_carrito, idProducto)=>{
      //verifico que exista el carrito cuyo _id uso para para buscar, retorno false si no existe
      const carSearch = await this.schema.find({_id:id_carrito})
      if (carSearch){
        //traigo los productos unicamente del carrito
        const car_prods = await this.schema.find({_id:id_carrito}, {productos:1})
        //realizo una normalización para poder aplicarle el length y poder leer los carritos
        const car_normalizado = await this.formatId(car_prods)
        //si retorno -1 es porque no hay productos en el carrito
        if(car_normalizado.productos.length > 0){
          //este arreglo almacenara los nuevos productos sin incluir aquel cuyo id sea a eliminar
          const nuevoArrayProductos = []

          const {productos} = car_normalizado
          for (const iterator of productos) {
            const prod_nomalizado = await this.formatId(iterator, 1)
            await prod_nomalizado._id != idProducto && nuevoArrayProductos.push(prod_nomalizado)
            await this.schema.updateOne({_id: id_carrito},{productos : nuevoArrayProductos})
          }
        }
        else{
          return -1
        }
      }
      return false
    }
    savee = async (obj) => {
        try {
          if(!obj.id){
            const nuevo = await new this.schema(obj)
            await nuevo.save()
            const carInDb = await this.schema.find({_id:nuevo._id}).limit(1)
            const idRes = await this.formatId(carInDb)
            return idRes.id
          }
          // else{
          //   const newe = new this.schema(obj,{id:{default: obj.id}, _id:false});
          //   await newe.save();
          // }
        } catch (error) {
            console.log("Error MongoGesetion-save():\n", error)
        }
    }
}