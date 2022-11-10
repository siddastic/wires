import { NodeFieldControllerData } from "../interfaces/widget";

export class NodeFieldController{
    constructor(public data : NodeFieldControllerData){}

    get value(){
        return this.data.element.value;
    }

    set value(value : string | number){
        this.data.element.value = String(value);
    }

    get numVal(){
        return Number(this.data.element.value);
    }
}