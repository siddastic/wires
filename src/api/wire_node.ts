import { NodeElement } from "../interfaces/node";
import { NodeFieldController } from "../interfaces/node_field_controller";
import { Vector2 } from "../interfaces/vector_2";
import { v4 as uuidv4 } from 'uuid';
import { DraggableUIElement } from "./draggable_ui_element";
import { bind } from "./decos";
import { Widget } from "./widgets";


export abstract class WireNode {
    public id = uuidv4();

    node: NodeElement = {
        element: document.createElement("div"),
        header: document.createElement("div"),
        headerTitle: document.createElement("div"),
        body: document.createElement("div"),
        fields: [],
    }
    constructor(private instantiatedPoint: Vector2) {
    }

    prebuild() {
        console.log("Node Pre Build Function called");
    }

    @bind
    onDrag() {
        console.log("Node Dragged");
    }

    abstract build(): Widget;

    destroy() {
        console.log("Destroying Node");
    }

    setupNode() {
        this.prebuild();
        const instance = this.build();
        const widget = instance.build();
        this.node.element = widget;
        this.node.header = widget.querySelector(".wire-node-header")!;
        widget.id = this.id;
        widget.style.top = `${this.instantiatedPoint.y}px`;
        widget.style.left = `${this.instantiatedPoint.x}px`;
        new DraggableUIElement(this.node.element, this.onDrag, this.node.header);
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
}
