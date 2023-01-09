import express from 'express';
import { rutaCarrito } from './Routes/carrito.js';
//importación de rutas
import {rutaProductos} from "./Routes/productos.js"

rutaProductos

const app = express();
const PUERTO = process.env.PORT || 8080;



const server = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en puerto-${server.address().port}`);
});

app.use("/api/productos", rutaProductos)
app.use("/api/carrito", rutaCarrito)



app.use((req, res, next) => {
  (!req.route) ? res.status(404).send({ error : -2, descripcion: `ruta ${req.url} no encontrada` }):next()
})
server.on("error", (error) => {
  console.log(`Error al levantar el servidor ${error}`);
});






