import {fsGestion} from "../fsGestion.js"
export default class ProductosFs extends fsGestion{
    constructor(){
        super("./src/files/productFile/productFile.txt")
    }
}