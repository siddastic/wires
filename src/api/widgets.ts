import { NodeFieldData } from "../interfaces/node";
import {
    CustomNodeElementData,
    NodeBodyData,
    NodeButtonData,
    NodeFooterData,
    NodeHeaderData,
    NodeScaffoldData,
} from "../interfaces/widget";
import { NodeFieldController } from "./node_field_controller";

export abstract class Widget {
    abstract build(): HTMLElement;

    postBuild(): void {}
}

export class NodeScaffold extends Widget {
    constructor(public data: NodeScaffoldData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node");
        if (this.data.header) {
            div.appendChild(this.data.header.build());
        }
        if (this.data.body) {
            div.appendChild(this.data.body.build());
        }
        if (this.data.footer) {
            div.appendChild(this.data.footer.build());
        }
        return div;
    }
}

export class NodeHeader extends Widget {
    constructor(public data: NodeHeaderData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-header");
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.data.title;
        div.appendChild(title);
        return div;
    }
}

export class NodeBody extends Widget {
    constructor(public data: NodeBodyData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-body");
        this.data.children.forEach((child) => {
            div.appendChild(child.build());
            child.postBuild();
        });
        return div;
    }
}

export class NodeFooter extends Widget {
    constructor(public data: NodeFooterData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-footer");
        div.appendChild(this.data.child.build());
        return div;
    }
}

export class NodeField extends Widget {
    input = document.createElement("input");
    constructor(public data: NodeFieldData) {
        super();
    }

    build() {
        const textField = document.createElement("div");
        const labelElement = document.createElement("div");
        textField.classList.add("text-field");
        labelElement.classList.add("label");
        labelElement.innerText = this.data.label || "...";
        this.input.type = this.data.type ?? "text";
        this.input.classList.add("input");
        textField.appendChild(labelElement);
        textField.appendChild(this.input);
        this.input.oninput = (ev) => {
            this.data.value = (ev.target as HTMLInputElement).value;
            this.data.onUpdate?.call(this.input.value);
        };
        this.input.placeholder = this.data.placeholder ?? "";
        this.input.value = this.data.value;
        return textField;
    }

    postBuild() {
        if (this.data.controller) {
            this.data.controller!(
                new NodeFieldController({
                    element: this.input,
                })
            );
        }
    }
}

export class NodeButton extends Widget {
    constructor(public data: NodeButtonData) {
        super();
    }

    build() {
        const button = document.createElement("button");
        button.classList.add("wire-button");
        button.innerText = this.data.label;
        if (this.data.onClick !== undefined) {
            button.addEventListener("click", (event)=>{
                this.data.onClick?.call(this);
                event.stopPropagation();
            });
        }
        return button;
    }
}

export class CustomNodeElement extends Widget {
    constructor(public data: CustomNodeElementData) {
        super();
    }

    build(): HTMLElement {
        const element = document.createElement(this.data.elementName);
        if (this.data.innerHTML) element.innerHTML = this.data.innerHTML;
        return element;
    }
}
