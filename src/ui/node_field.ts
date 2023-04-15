import {
    provideFASTDesignSystem,
    fastTextField,
    fastOption,
    fastCombobox,
} from "@microsoft/fast-components";

import { UIElement } from "./ui_element";
import { WireGraph } from "../api/graph/wire_graph";
import "../styles/ui/node_field.css";

provideFASTDesignSystem()
    .withPrefix("wires")
    .register(fastTextField(), fastCombobox(), fastOption());

interface NodeFieldData {
    label?: string;
    placeholder?: string;
    options?: string[];
}

export class NodeField extends UIElement {
    labelElement!: HTMLDivElement;
    inputElement!: HTMLElement;
    constructor(public data: NodeFieldData, public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }

    get shouldBuildComboBox() {
        return this.data.options && this.data.options.length > 0;
    }

    build() {
        let div = document.createElement("div");
        div.classList.add("node-field-container");
        this.labelElement = this.buildLabel();
        this.inputElement = this.shouldBuildComboBox ? this.buildComboBox() : this.buildInput();

        div.appendChild(this.labelElement);
        div.appendChild(this.inputElement);

        return div;
    }

    private buildLabel() {
        let label = document.createElement("div");
        label.classList.add("node-field-label");
        label.innerText = this.data.label ?? "";
        return label;
    }

    private buildInput() {
        let field = document.createElement("wires-text-field");
        field.id = this.id;
        field.classList.add("node-field");
        field.setAttribute("placeholder", this.data.placeholder ?? "");
        return field;
    }

    sortOptions() {
        if(!this.data.options) return;
        let options = Array.from(this.data.options);
        options.sort((a, b) => {
            let aText = a?.toLowerCase() ?? "";
            let bText = b?.toLowerCase() ?? "";
            return aText.localeCompare(bText);
        });
        this.data.options = options.map((option) => option ?? "");
    }

    private buildComboBox() {
        let field = document.createElement("wires-combobox");
        field.id = this.id;
        field.setAttribute("autocomplete", "both");
        field.classList.add("node-field");
        field.setAttribute("placeholder", this.data.placeholder ?? "");

        // sort options alphabetically
        this.sortOptions();

        this.data.options?.forEach((option) => {
            let opt = document.createElement("wires-option");
            opt.innerHTML = option;
            field.appendChild(opt);
        });
        return field;
    }
}
