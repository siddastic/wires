import { Widget } from "./widgets";

export class DataBoard extends Widget {
    constructor() {
        super();
    }

    createBoard() {
        const div = document.createElement("div");
        div.classList.add("data-board");

        const header = document.createElement("div");
        header.classList.add("data-board-header");

        const headerText = document.createElement("div");
        headerText.classList.add("data-board-header-text");
        headerText.innerText = "Untitled";
        headerText.contentEditable = "true";
        headerText.style.outline = "none";

        const icon = document.createElement("div");
        icon.classList.add("codicon");
        icon.classList.add("codicon-add");

        icon.onclick = () => {};

        header.appendChild(headerText);
        header.appendChild(icon);
        div.appendChild(header);
        return div;
    }
    build(): HTMLElement {
        return this.createBoard();
    }
}
