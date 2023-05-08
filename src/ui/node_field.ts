import {
    provideFASTDesignSystem,
    fastTextField,
    fastOption,
    fastCombobox,
} from "@microsoft/fast-components";

import { UIElement } from "./ui_element";
import { WireGraph } from "../api/graph/wire_graph";
import "../styles/ui/node_field.css";
import { NodeConnector, NodeConnectorStyle } from "./node_connector";

provideFASTDesignSystem()
    .withPrefix("wires")
    .register(fastTextField(), fastCombobox(), fastOption());

export type NodeFieldType = "connect-in" | "input" | "connect-out" | "input-in";

export interface NodeFieldData {
    label?: string;
    placeholder?: string;
    options?: string[];
    type?: NodeFieldType;
    connectorStyle?: NodeConnectorStyle;
    allowMultidrop?: boolean;
}

export class NodeField extends UIElement {
    connector!: NodeConnector;
    labelElement!: HTMLDivElement;
    inputElement!: HTMLElement;
    constructor(public data: NodeFieldData, public graphInstance: WireGraph) {
        super(graphInstance);
        // set a default type
        if (!this.data.type) {
            this.data.type = "input";
        }
        if (!this.data.connectorStyle) {
            this.data.connectorStyle = "on-edge";
        }
        this.element = this.build();
    }

    get shouldBuildComboBox() {
        return this.data.options && this.data.options.length > 0;
    }

    protected build() {
        let div = document.createElement("div");
        div.classList.add("node-field-container");
        this.labelElement = this.buildLabel();
        this.inputElement = this.shouldBuildComboBox
            ? this.buildComboBox()
            : this.buildInput();

        if (this.data.type != "input") {
            this.connector = new NodeConnector(
                {
                    direction:
                        this.data.type == "connect-in" || this.data.type == "input-in" ? "input" : "output",
                    style: this.data.connectorStyle!,
                    allowMultidrop: this.data.allowMultidrop,
                },
                this.graphInstance
            );

            // append connector to the left side
            if(this.data.connectorStyle == "on-inside"){
                if(this.data.type == "connect-in" || this.data.type == "input-in"){
                    div.appendChild(this.connector.element);
                }
            }else{
                div.appendChild(this.connector.element);
            }
        }
        div.appendChild(this.labelElement);
        if (this.data.type == "input" || this.data.type == "input-in") {
            div.appendChild(this.inputElement);
        }

        // append connector to the right side
        if(this.data.connectorStyle == "on-inside"){
            if(this.data.type == "connect-out"){
                this.connector.element.style.marginRight = "unset";
                div.appendChild(this.connector.element);
            }

        }

        // if its an out connector.. align label to the right
        if(this.data.type == "connect-out"){
            div.style.justifyContent = "flex-end";
        }

        return div;
    }

    protected buildLabel() {
        let label = document.createElement("div");
        label.classList.add("node-field-label");
        if(this.data.type == "connect-out" && this.data.connectorStyle == "on-edge"){
            label.style.marginRight = "unset";
        }
        label.innerText = this.data.label ?? "";
        return label;
    }

    protected buildInput() {
        let field = document.createElement("wires-text-field");
        field.id = this.id;
        field.classList.add("node-field");
        field.setAttribute("placeholder", this.data.placeholder ?? "");
        return field;
    }

    sortOptions() {
        if (!this.data.options) return;
        let options = Array.from(this.data.options);
        options.sort((a, b) => {
            let aText = a?.toLowerCase() ?? "";
            let bText = b?.toLowerCase() ?? "";
            return aText.localeCompare(bText);
        });
        this.data.options = options.map((option) => option ?? "");
    }

    protected buildComboBox() {
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
