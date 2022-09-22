import { bind } from "./decos";

export abstract class WireNode {
    name: string;
    node = {
        element: document.createElement("div"),
        header: document.createElement("div"),
        headerTitle: document.createElement("div"),
        body: document.createElement("div"),
        textField: document.createElement("div"),
        label: document.createElement("div"),
        input: document.createElement("input")
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
        this.node.textField.classList.add("text-field");
        this.node.label.classList.add("label");
        this.node.label.innerText = "lang";
        this.node.input.type = "text";
        this.node.input.value = "en";
        this.node.input.classList.add("input");

        this.node.header.appendChild(this.node.headerTitle);
        this.node.textField.appendChild(this.node.label);
        this.node.textField.appendChild(this.node.input);
        this.node.body.appendChild(this.node.textField);
        this.node.element.appendChild(this.node.header);
        this.node.element.appendChild(this.node.body);

        // this.attachDragEvents();
    }

    attachDragEvents() {
        this.node.element.addEventListener("dragstart", (e) => {
            console.log("mousedown");
            this.node.element.addEventListener("mousemove", this.onDrag);
        });
        this.node.element.addEventListener("dragend", (e) => {
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


}