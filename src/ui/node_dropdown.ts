import { fastSelect, provideFASTDesignSystem } from "@microsoft/fast-components";
import { UIElement } from "./ui_element";
import { WireGraph } from "../api/graph/wire_graph";
import "../styles/ui/node_dropdown.css";

provideFASTDesignSystem().withPrefix("wires").register(fastSelect());

export interface NodeDropdownData{
    label: string;
    options: string[];
}

export class NodeDropdown extends UIElement{
    constructor(public data : NodeDropdownData,public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }
    protected build(): HTMLElement {
        let container = document.createElement("div");
        container.id = this.id;
        container.classList.add("node-dropdown-container");

        let label = this.buildLabel();
        let dropdown = this.buildDropdown();

        container.appendChild(label);
        container.appendChild(dropdown);
        return container;
    }

    protected buildLabel(){
        let label = document.createElement("div");
        label.classList.add("node-dropdown-label");
        label.innerText = this.data.label;
        return label;
    }

    protected buildDropdown(){
        let dropdown = document.createElement("wires-select");
        dropdown.setAttribute("appearance", "filled");
        dropdown.setAttribute("placeholder", "Select an option");
        for(let option of this.data.options){
            let optionElement = document.createElement("wires-option");
            optionElement.setAttribute("value", option);
            optionElement.innerText = option;
            dropdown.appendChild(optionElement);
        }
        return dropdown;
    }
}