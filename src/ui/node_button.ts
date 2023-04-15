import { fastButton, provideFASTDesignSystem } from "@microsoft/fast-components";
import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";


provideFASTDesignSystem()
    .withPrefix("wires")
    .register(
        fastButton()
    );


export interface NodeButtonData{
    label: string;
    onClick?: () => void;
}

export class NodeButton extends UIElement{
    constructor(public data : NodeButtonData,public graphInstance: WireGraph){
        super(graphInstance);
        this.element = this.build();
    }

    protected build(){
        let button = document.createElement("wires-button");
        button.innerText = this.data.label;
        this.data.onClick && button.addEventListener("click",this.data.onClick);
        return button;
    }
}