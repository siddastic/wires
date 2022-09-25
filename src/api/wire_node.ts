import { NodeElement } from "../interfaces/node";
import { NodeFieldController } from "../interfaces/node_field_controller";
import { Vector2 } from "../interfaces/vector_2";
import { v4 as uuidv4 } from 'uuid';
import { DraggableUIElement } from "./draggable_ui_element";

export abstract class WireNode {
    name: string;
    public id = uuidv4();

    node: NodeElement = {
        element: document.createElement("div"),
        header: document.createElement("div"),
        headerTitle: document.createElement("div"),
        body: document.createElement("div"),
        fields: [],
    }
    constructor(private instantiatedPoint : Vector2) {
        this.name = this.constructor.name;
    }
    setupNode() {
        this.node.element.id = this.id;
        this.node.element.classList.add("wire-node");
        this.node.header.classList.add("wire-node-header");
        this.node.headerTitle.classList.add("title");
        this.node.headerTitle.innerText = this.name;
        this.node.body.classList.add("wire-node-body");

        this.node.header.appendChild(this.node.headerTitle);
        this.node.element.appendChild(this.node.header);
        this.node.element.appendChild(this.node.body);

        this.node.element.style.top = `${this.instantiatedPoint.y}px`;
        this.node.element.style.left = `${this.instantiatedPoint.x}px`;

        new DraggableUIElement(this.node.element, this.node.header);

        globalThis.globalNodeRegistry.registerInstance(this);
    }

    createField(field: NodeFieldController) {
        const textField = document.createElement("div");
        const labelElement = document.createElement("div");
        const input = document.createElement("input");
        textField.classList.add("text-field");
        labelElement.classList.add("label");
        labelElement.innerText = field.label || "...";
        input.type = field.type ?? 'text';
        input.classList.add("input");
        textField.appendChild(labelElement);
        textField.appendChild(input);
        this.node.body.appendChild(textField);
        field.element = input;
        input.oninput = (ev) => {
            field.value = (ev.target as HTMLInputElement).value;
            field.onUpdate?.call(input.value);
        }
        input.placeholder = field.placeholder ?? "";
        input.value = field.value;
        this.node.fields.push(textField);
    }

    abstract outNode() : string | void;
}