//indice para exportar modulos de creados para mongo
import productosMongo from "../daos/mongoDaos/productosDaosMg.js"
import carritoMongo from "../daos/mongoDaos/carritoDaosMg.js"
import coneccion from "../config/conectionMgDb.js"

export const coneccionMongo =  coneccion
export const productosDaosMg = productosMongo
export const carritoDaosMg = carritoMongo
