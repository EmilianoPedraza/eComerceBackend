
const {productos} = require("../files/fsGestion")

const express = require("express");
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
    const listadoProductos = await productos.getAll()
    if(listadoProductos.length > 0){;
       const resultado = await productos.getById(parseInt(id))
       resultado !== null? res.json(resultado) : res.json({status : "no encontrado"})
    }
    else{
        res.json({status: "no hay productos para buscar"})
    }
})
rutaProductos.get("/", async(req, res)=>{
    const listadoProductos = await productos.getAll()
    res.json(listadoProductos)
})


rutaProductos.post("/",privilegio, async(req, res)=>{
    const newObj = req.body
    await productos.save(newObj)
    res.json({status: "ok"})
})

rutaProductos.put("/:id",privilegio, async(req, res)=>{
    const id = parseInt(req.params.id)
    const {body} = req
    const actualizacion = await productos.update(id, body)
    actualizacion === null ? res.json({status:"producto a actualizar no encontrado"}) : res.json({
        status: "ok"
    })
})

rutaProductos.delete("/:id",privilegio, async(req, res)=>{
    const {id} = req.params
    const deleteB = await productos.getDeleteById(parseInt(id))
    deleteB === null ? res.json({status:"producto a eliminar no encontrado"}) : res.json({status: "ok"})
})

exports.rutaProductos = rutaProductos