import FireBaseGestion from "../../fireBaseGestion.js";

export default class FirBasDaoCarrito extends FireBaseGestion {
  constructor() {
    super("carritos");
  }
  apushProdIdCarFb = async (id, prod) => {
    try {
      const carrito = await this.coleccion.doc(id).get();
      const carNormal = carrito.data();
      const listaProductosCar = [...carNormal.productos, prod];
      carNormal.productos = listaProductosCar;
      await this.coleccion.doc(id).update(carNormal);
      console.log("El producto:\n", prod, "\nSE AGREGO CORRECTAMENTE.");
    } catch (error) {
      console.log("Error en FirBasDaoCarrito-apushProdIdCarFb():\n", error);
    }
  };
  removeFromCart = async (idCar, idProd) => {
    try {
      const carrito = await this.coleccion.doc(idCar).get();
      const nuevoCar = carrito.data()
      if(nuevoCar.productos.length > 0){
        const nuevaLista = nuevoCar.productos
        let indice = 0
        for (const prod of nuevaLista) {
          if(prod.id === idProd){
            break
          }
          indice ++
        }
        nuevaLista.splice(indice,1)
        nuevoCar.productos = nuevaLista
        await this.coleccion.doc(idCar).update(nuevoCar)

      }
    } catch (error) {
      console.log("Error en FirBasDaosCarrito-removeFromCart():\n", error);
    }
  };
}
