import "../styles/ui/node.css";

export class NodeUI {
    public nodeElement: HTMLElement;
    public header!: HTMLElement;
    public body!: HTMLElement;
    public footer!: HTMLElement;
    constructor(public id: string, public title : string) {
        this.nodeElement = this.buildNodeElement();
    }

    private buildNodeElement() : HTMLElement{
        const div = document.createElement("div");
        div.id = this.id;
        div.classList.add("wire-node");

        this.buildNodeTree(div);
        return div;
    }

    private buildNodeTree(appendTo : HTMLElement){
        // calls all builder functions and stores them in class variables
        this.header = this.buildNodeHeader();
        this.body = this.buildNodeBody();
        this.footer = this.buildNodeFooter();

        // append all the elements to the node element
        appendTo.appendChild(this.header);
        appendTo.appendChild(this.body);
        appendTo.appendChild(this.footer);
    }

    private buildNodeHeader() : HTMLElement{
        const div = document.createElement("div");
        div.classList.add("wire-node-header");
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.title;
        div.appendChild(title);
        return div;
    }

    private buildNodeBody() : HTMLElement{
        const div = document.createElement("div");
        div.classList.add("wire-node-body");
        
        return div;
    }

    private buildNodeFooter() : HTMLElement{
        const div = document.createElement("div");
        div.classList.add("wire-node-footer");
        return div;
    }
}
