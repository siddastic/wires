import {
    provideFASTDesignSystem,
    fastTextField,
} from "@microsoft/fast-components";

import { UIElement } from "./ui_element";
import { WireGraph } from "../api/graph/wire_graph";
import "../styles/ui/node_field.css";

provideFASTDesignSystem().withPrefix("wires").register(fastTextField());

interface NodeFieldData{
    label: string;
    placeholder?: string;
    options?: string[];
}

export class NodeField extends UIElement{
    constructor(public data: NodeFieldData,public graphInstance: WireGraph){
        super(graphInstance);
        this.element = this.build();
    }

    build(){
        let field = document.createElement("wires-text-field");
        field.id = this.id;
        field.classList.add("node-field");
        field.setAttribute("placeholder", this.data.placeholder ?? "");
        return field;
    }
}