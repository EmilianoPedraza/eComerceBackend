//---------import daos productos e instanciamiento de fileSistem
import productosFs from "../fsGestion/daos/productoDaos.js"
//instancia
const productos = new productosFs
//---------import daos productos de mongo e instanciamiento. Y conección
import { productosDaosMg, coneccionMongo} from "../MgDb_FireBas_Gestion/modules/moduleIndexMgDb.js";
//conección
coneccionMongo()
//instancia de la clase productos con sus metodos para modificar y leer la colección de productos en mongo atlas
const productoMongo = new productosDaosMg

//----- import de lo que se necestia para gestionar con fire-base
import { prodsFireBase} from "../MgDb_FireBas_Gestion/modules/moduleIndexFireB.js";
//instancia productos en fireBase, a diferencia de mongo la coneccion se realiza en la clase instanciada
const productosFireBase = new prodsFireBase



import express from 'express';
const { Router } = express;

const privilegio = (req, res, next)=>{
    const administrador = req.headers.administrador
    administrador === "true" ? next() : res.status(401).send(`{error: -1, descripcion: ruta ${req.url} no autorizada}`)
}

const rutaProductos = Router()

rutaProductos.use(express.json());
rutaProductos.use(express.urlencoded({ extended: true }));



rutaProductos.get("/:id", async (req, res)=>{
    const {id} = req.params
    const productoSearch = await productoMongo.getById(id)
    await productosFireBase.getByIdFb(id)
    await (productoSearch.length) > 0? res.json(productoSearch) : res.json({status : "no encontrado"})
})


rutaProductos.get("/", async(req, res)=>{
    const listadoProductos = await productos.getAll()
    await productosFireBase.getAllFb()
    res.json(listadoProductos)
})


rutaProductos.post("/",privilegio, async(req, res)=>{
    const newObj = req.body
    const mId = await productoMongo.savee(newObj)
    mId? await productos.save({id:mId,...newObj}) : await productos.save(newObj) 
    mId && await productosFireBase.saveeFb(newObj, mId)
    res.json({status: "ok"})
})

rutaProductos.put("/:id",privilegio, async(req, res)=>{
    const {id} = req.params
    const {body} = req
    const actualizacion = await productos.update(id, {id,...body})//se le agrega id para que no se genere solo
    await productoMongo.update(id,body)
    await productosFireBase.updateFb(id, body)
    actualizacion === null ? res.json({status:"producto a actualizar no encontrado"}) : res.json({
        status: "ok"
    })
})

rutaProductos.delete("/:id",privilegio, async(req, res)=>{
    const {id} = req.params
    const deleteB = await productos.getDeleteById(id)
    await productoMongo.getDeleteById(id)
    await productosFireBase.deleteByIdFb(id)
    deleteB === null ? res.json({status:"producto a eliminar no encontrado"}) : res.json({status: "ok"})
})

export { rutaProductos };