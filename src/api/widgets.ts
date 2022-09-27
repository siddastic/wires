import { NodeFieldData } from "../interfaces/node";
import {
    CustomNodeElementData,
    NodeBodyData,
    NodeFooterData,
    NodeHeaderData,
    NodeScaffoldData,
} from "../interfaces/widget";
import { NodeFieldController } from "./node_field_controller";

export abstract class Widget {
    abstract build(): HTMLElement;
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
    constructor(public data: NodeFieldData) {
        super();
    }

    build() {
        const textField = document.createElement("div");
        const labelElement = document.createElement("div");
        const input = document.createElement("input");
        textField.classList.add("text-field");
        labelElement.classList.add("label");
        labelElement.innerText = this.data.label || "...";
        input.type = this.data.type ?? "text";
        input.classList.add("input");
        textField.appendChild(labelElement);
        textField.appendChild(input);
        input.oninput = (ev) => {
            this.data.value = (ev.target as HTMLInputElement).value;
            this.data.onUpdate?.call(input.value);
        };
        input.placeholder = this.data.placeholder ?? "";
        input.value = this.data.value;
        if (this.data.controller) {
            setTimeout(()=>{
                // Calling controller callback after 0 timeout because input element is not ready yet, see issue #1
                this.data.controller!(
                    new NodeFieldController({
                        element: input,
                    })
                );
            });
        }
        return textField;
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
