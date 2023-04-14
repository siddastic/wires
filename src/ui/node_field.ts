import {
    provideFASTDesignSystem,
    fastTextField,
} from "@microsoft/fast-components";

import { UIElement } from "./ui_element";
import { WireGraph } from "../api/graph/wire_graph";
import "../styles/ui/node_field.css";

provideFASTDesignSystem().withPrefix("wires").register(fastTextField());

interface NodeFieldData{
    label?: string;
    placeholder?: string;
    options?: string[];
}

export class NodeField extends UIElement{
    labelElement!: HTMLDivElement;
    inputElement!: HTMLElement;
    constructor(public data: NodeFieldData,public graphInstance: WireGraph){
        super(graphInstance);
        this.element = this.build();
    }

    build(){
        let div = document.createElement("div");
        div.classList.add("node-field-container");
        this.labelElement = this.buildLabel();
        this.inputElement = this.buildInput();

        div.appendChild(this.labelElement);
        div.appendChild(this.inputElement);

        return div;
    }

    private buildLabel(){
        let label = document.createElement("div");
        label.classList.add("node-field-label");
        label.innerText = this.data.label ?? "";
        return label;
    }

    private buildInput(){
        let field = document.createElement("wires-text-field");
        field.id = this.id;
        field.classList.add("node-field");
        field.setAttribute("placeholder", this.data.placeholder ?? "");
        return field;
    }
}