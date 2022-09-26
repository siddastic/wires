import { NodeBodyData, NodeFooterData, NodeHeaderData, NodeScaffoldData } from "../interfaces/widget";

export abstract class Widget {
    abstract build(): HTMLElement;
}

export class NodeScaffold extends Widget {
    constructor(public data : NodeScaffoldData) {
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
    constructor(public data : NodeHeaderData) {
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
    constructor(public data : NodeFooterData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-footer");
        div.appendChild(this.data.child.build());
        return div;
    }
}