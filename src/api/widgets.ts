export abstract class Widget {
    abstract build(): HTMLElement;
}

export class NodeScaffold extends Widget {
    constructor(public header?: Widget, public body?: Widget, public footer?: Widget) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node");
        if (this.header) {
            div.appendChild(this.header.build());
        }
        if (this.body) {
            div.appendChild(this.body.build());
        }
        if (this.footer) {
            div.appendChild(this.footer.build());
        }
        return div;
    }
}


export class NodeHeader extends Widget {
    constructor(public title: string) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-header");
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.title;
        div.appendChild(title);
        return div;
    }
}

export class NodeBody extends Widget {
    constructor(public children: Widget[]) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-body");
        this.children.forEach((child) => {
            div.appendChild(child.build());
        });
        return div;
    }
}

export class NodeFooter extends Widget {
    constructor(public child : Widget) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-footer");
        div.appendChild(this.child.build());
        return div;
    }
}