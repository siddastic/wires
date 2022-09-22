import { NodeElement } from "../interfaces/node";
import { NodeFieldController } from "../interfaces/node_field_controller";
import { bind } from "./decos";

export abstract class WireNode {
    name: string;
    node: NodeElement = {
        element: document.createElement("div"),
        header: document.createElement("div"),
        headerTitle: document.createElement("div"),
        body: document.createElement("div"),
        fields: [],
    }
    constructor() {
        this.name = this.constructor.name;
    }
    setupNode() {
        this.node.element.classList.add("wire-node");
        this.node.header.classList.add("wire-node-header");
        this.node.headerTitle.classList.add("title");
        this.node.headerTitle.innerText = this.name;
        this.node.body.classList.add("wire-node-body");

        this.node.header.appendChild(this.node.headerTitle);
        this.node.element.appendChild(this.node.header);
        this.node.element.appendChild(this.node.body);

        this.attachDragEvents();
    }

    attachDragEvents() {
        this.node.element.addEventListener("mousedown", () => {
            console.log("mousedown");
            this.node.element.addEventListener("mousemove", this.onDrag);
        });
        this.node.element.addEventListener("mouseup", () => {
            console.log("mouseup");
            this.node.element.removeEventListener("mousemove", this.onDrag);
        });
    }

    @bind
    onDrag(ev: MouseEvent) {
        let getStyle = window.getComputedStyle(this.node.element);
        const { movementX, movementY } = ev;
        let left = parseFloat(getStyle.left);
        let top = parseFloat(getStyle.top);

        this.node.element.style.left = `${left + movementX}px`;
        this.node.element.style.top = `${top + movementY}px`;
    }

    createField(field : NodeFieldController) {
        const textField = document.createElement("div");
        const labelElement = document.createElement("div");
        const input = document.createElement("input");
        textField.classList.add("text-field");
        labelElement.classList.add("label");
        labelElement.innerText = field.label || "...";
        input.type = "text";
        input.classList.add("input");
        textField.appendChild(labelElement);
        textField.appendChild(input);
        this.node.body.appendChild(textField);
        input.oninput = (ev) => {
            field.value = (ev.target as HTMLInputElement).value;
            field.onUpdate?.call(input.value);
        }
        input.placeholder = field.placeholder ?? "";
        input.value = field.value;
        this.node.fields.push(textField);
    }


}