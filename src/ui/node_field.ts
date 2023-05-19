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
    valueToSend? : () => any;
}

export class NodeField extends UIElement {
    id = uniqueIdGenerator.create();
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

        // register node field after the node is rendered in the dom so that we can find the node id
        queueMicrotask(() => {
            this.registerNodeField();
        });
    }

    get shouldBuildComboBox() {
        return this.data.options && this.data.options.length > 0;
    }

    private registerNodeField() {
        // find node id from the parent node
        let nodeID = this.element.closest(".wire-node")!.id;
        this.graphInstance.globalNodeTree.addNodeFieldToTree(nodeID, this);
    }

    protected build() {
        let div = document.createElement("div");
        div.classList.add("node-field-container");
        div.id = this.id;
        this.labelElement = this.buildLabel();
        this.inputElement = this.shouldBuildComboBox
            ? this.buildComboBox()
            : this.buildInput();

        if (this.data.type != "input") {
            this.connector = new NodeConnector(
                {
                    direction:
                        this.data.type == "connect-in" ||
                        this.data.type == "input-in"
                            ? "input"
                            : "output",
                    style: this.data.connectorStyle!,
                    allowMultidrop: this.data.allowMultidrop,
                    onBeforeValueReceive: (value) => {
                        if(!value){
                            // terminate the function if there is no value to receive
                            return;
                        }
                        // TODO : remove when database is implemented
                        // if the connector is an input, we need to set the value of the input field
                        if (
                            this.data.type == "input-in" ||
                            this.data.type == "input"
                        ) {
                            this.inputElement.shadowRoot!.querySelector(
                                "input"
                            )!.value = value;
                        }
                    },
                    onBeforeValueSend: () => {
                        // TODO : remove when database is implemented
                        return this.data.valueToSend?.call(this);
                    },
                },
                this.graphInstance
            );

            // append connector to the left side
            if (this.data.connectorStyle == "on-inside") {
                if (
                    this.data.type == "connect-in" ||
                    this.data.type == "input-in"
                ) {
                    div.appendChild(this.connector.element);
                }
            } else {
                div.appendChild(this.connector.element);
            }
        }
        div.appendChild(this.labelElement);
        if (this.data.type == "input" || this.data.type == "input-in") {
            div.appendChild(this.inputElement);
        }

        // append connector to the right side
        if (this.data.connectorStyle == "on-inside") {
            if (this.data.type == "connect-out") {
                this.connector.element.style.marginRight = "unset";
                div.appendChild(this.connector.element);
            }
        }

        // if its an out connector.. align label to the right
        if (this.data.type == "connect-out") {
            div.style.justifyContent = "flex-end";
        }

        return div;
    }

    protected buildLabel() {
        let label = document.createElement("div");
        label.classList.add("node-field-label");
        if (
            this.data.type == "connect-out" &&
            this.data.connectorStyle == "on-edge"
        ) {
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

    public getValueFromFieldInput() {
        let input = this.inputElement.shadowRoot!.querySelector("input")!;
        return input.value;
    }
}
