import { WireGraph } from "../api/graph/wire_graph";

export abstract class UIElement {
    element!: HTMLElement;
    visible = true;
    id = globalThis.uniqueIdGenerator.create();
    constructor(public graphInstance: WireGraph) {
    }

    protected abstract build(): HTMLElement;

    hide(){
        this.element.style.display = "none";
        this.visible = false;
    }

    show(){
        this.element.style.display = "";
        this.visible = true;
    }

    toggleVisibility(){
        if(this.visible){
            this.hide();
        }else{
            this.show();
        }
    }
}
