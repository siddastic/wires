import { NodeFieldControllerData } from "../interfaces/widget";

export class NodeFieldController{
    constructor(public data : NodeFieldControllerData){}

    get value(){
        return this.data.element.value;
    }

    set value(value : string){
        this.data.element.value = value;
    }
}