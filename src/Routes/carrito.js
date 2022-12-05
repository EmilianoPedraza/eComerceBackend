
const { carrito, productos} = require("../files/fsGestion");

const express = require("express");
const { Router } = express;

const rutaCarrito = Router();

rutaCarrito.use(express.json());
rutaCarrito.use(express.urlencoded({ extended: true }));


rutaCarrito.get("/:id/productos", async (req, res) => {
  const id = parseInt(req.params.id);
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
  await carrito.save(newCar);
  res.json({ id_carrito: carrito.id });
});

rutaCarrito.post("/:id/productos", async (req, res) => {
  const id = parseInt(req.params.id);
  const { idProducto } = req.body;
  const producto = await productos.getById(idProducto);
  const carritoIncor = await carrito.getById(id);
  if (carritoIncor !== null) {
    carritoIncor.productos.push(producto);
    await carrito.update(id, carritoIncor);
    res.json({ status: "ok" });
  } else {
    res.json({ status: `carrito ${id} no encontrado, operación imposible` });
  }
});

rutaCarrito.delete("/:id/productos/:id_producto", async (req, res) => {
  const id = parseInt(req.params.id);
  const id_producto = parseInt(req.params.id_producto);
  const car = await carrito.getById(id);
  if (car === null) {
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

exports.rutaCarrito = rutaCarrito;
