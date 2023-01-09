import {fsGestion} from "../fsGestion.js"
export default class CarritoFs extends fsGestion{
    constructor(){
        super("./src/files/CarFile/carFile.txt")
    }
}