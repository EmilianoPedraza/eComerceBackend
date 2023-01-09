import admin from "firebase-admin";
import { createRequire } from "module"; // Incorpora la capacidad de crear el método 'require'
const require = createRequire(import.meta.url); // construye el método require
const serviceAccount = require("./ecomerce-backend-53cdc-firebase-adminsdk-1gruq-db3554e0cc.json") // usando require

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
export default (colecion) =>{
    const db = admin.firestore()
    const conectarA = db.collection(colecion)
    return conectarA
}
