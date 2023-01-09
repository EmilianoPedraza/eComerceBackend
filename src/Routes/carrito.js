//imports daos de sistema para filesistem
import productosFs from "../fsGestion/daos/productoDaos.js"
import carritoFS from "../fsGestion/daos/carritoDaos.js"
//instanciamiento de lo anterior
const productos = new productosFs
const carrito = new carritoFS
//imports de daos de sistema para mongoDb atlas
import {productosDaosMg, carritoDaosMg, coneccionMongo} from "../MgDb_FireBas_Gestion/modules/moduleIndexMgDb.js"
//estableciendo conección
coneccionMongo()
//instanciamiento de productos y carrito de para las colecciones de mongo
const productosMongo = new productosDaosMg
const carritoMongo = new carritoDaosMg


import express from "express"
const { Router } = express;

const rutaCarrito = Router();

rutaCarrito.use(express.json());
rutaCarrito.use(express.urlencoded({ extended: true }));


rutaCarrito.get("/:id/productos", async (req, res) => {
  const {id} = req.params
  const listadoCarrito = await carrito.getById(id);
  if (listadoCarrito === null) {
    res.json({ status: `carrito ${id} no encontrado` });
  } else {
    listadoCarrito.productos.length > 0
      ? res.json(listadoCarrito.productos)
      : res.json({ status: `no hay productos en carrito ${id}` });
  }
});


rutaCarrito.post("/", async (req, res) => {
  const newCar = {
    tiemstamp: Date.now(),
    productos: [],
  };
  const id_car = await carritoMongo.savee(newCar)
  if(id_car){
    await carrito.save({id:id_car,...newCar});
  }
  res.json({ id_carrito: id_car });
});


rutaCarrito.post("/:id/productos", async (req, res) => {
  const {id} = req.params
  const { idProducto } = req.body;
  //se busca el cliente usando el id en entre los almacenados en archivos txt
  const carritoIncor = await carrito.getById(id)
  if (carritoIncor) {
    //APARTADO DE MONGO
    //busco el producto en la colección de productos de la colección en atlas
    const producto = await productosMongo.getById(idProducto);
    //se agrega producto al cliente en la colección de atlas
    await carritoMongo.apushProdIdCar(id, producto)

    //APARTADO DE ARCHIVOS TXT
    //se busca el producto pero en la colección de 
    const prodTxt = await productos.getById(idProducto)
    await carritoIncor.productos.push(prodTxt)
    
    await carrito.update(id, carritoIncor);

    res.json({ status: "ok" });
  } else {
    res.json({ status: `carrito ${id} no encontrado, operación imposible` });
  }
});


rutaCarrito.delete("/:id/productos/:id_producto", async (req, res) => {
  const {id} = req.params
  const id_producto = req.params.id_producto;
  //se busca carrito en archivo txt
  const car = await carrito.getById(id);
    //se busca carrito en su respectiva colección respecto a mongo atlas
  const carrito_modi = await carritoMongo.deleteProdIdCar(id, id_producto)
  if (car === null && (carrito_modi)) {
    res.json({ status: `carrito ${id} no encontrado, operación imposible` });
  } else {
    if (car.productos.length === 0) {
      res.json({ status: `no hay productos en carrito ${id}` });
    } else {
      let indexToDel = -1;
      car.productos.forEach((prd, i) => {
        if (prd.id === id_producto) {
          indexToDel = i;
          return;
        }
      });
      if (indexToDel === -1) {
        res.json({ status: `producto -${id_producto} no encontrado...` });
      } else {
        car.productos.splice(indexToDel, 1);
        await carrito.update(id, car);
        res.json({ status: "ok" });
      }
    }
  }
});

export {rutaCarrito};
