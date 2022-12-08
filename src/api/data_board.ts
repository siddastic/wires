import "../styles/ui/databoard.css";
import { bind } from "./decorators";
import { DropdownMenu, Widget } from "./widgets";

export class DataBoard extends Widget {
    variables: DataboardVariable[] = [];
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

        icon.onclick = () => {
            div.appendChild(this.addVariable());
        };

        header.appendChild(headerText);
        header.appendChild(icon);
        div.appendChild(header);

        return div;
    }

    build(): HTMLElement {
        return this.createBoard();
    }

    addVariable() {
        let variable = new DataboardVariable();
        this.variables.push(variable);
        let element = variable.build();

        setTimeout(() => {
            // @ts-ignore
            globalThis.find("new variable");
        }, 0);
        return element;
    }
}

export class DataboardVariable extends Widget {
    label: string = "new variable";
    id: string = uniqueIdGenerator.create();
    open: boolean = false;
    datatype = "string";
    value : any = "";
    constructor() {
        super();
    }

    createDraggableTitle() {
        const div = document.createElement("div");
        div.classList.add("data-board-variable-title");
        div.contentEditable = "true";
        div.innerText = this.label;

        div.addEventListener("input", () => {
            this.label = div.innerText;
        });
        return div;
    }

    build(): HTMLElement {
        const div = document.createElement("div");
        div.id = this.id;
        div.classList.add("data-board-variable");
        const left = document.createElement("div");
        left.classList.add("data-board-variable-left");
        const right = document.createElement("div");
        right.classList.add("data-board-variable-right");

        const arrow = document.createElement("div");
        arrow.classList.add("codicon");
        arrow.addEventListener("click", this.toggleOpen);
        if (this.open) {
            arrow.classList.add("codicon-chevron-down");
        } else {
            arrow.classList.add("codicon-chevron-right");
        }

        const trailing = document.createElement("div");
        trailing.innerText = this.datatype;
        trailing.classList.add("data-board-variable-trailing");

        left.appendChild(arrow);
        left.appendChild(this.createDraggableTitle());
        right.appendChild(trailing);
        div.appendChild(left);
        div.appendChild(right);
        return div;
    }

    createOptions() {
        const div = document.createElement("div");
        div.classList.add(`${this.id}-options`);
        div.style.paddingLeft = "20px";
        div.style.paddingRight = "20px";

        const dataType = document.createElement("div");
        const dropdown = new DropdownMenu({
            label: "type",
            options: [
                {
                    value: "string",
                },
                {
                    value: "number",
                },
                {
                    value: "boolean",
                },
            ],
            onChange: (value) => {
                this.datatype = value ?? "string";
                this.rebuild();
                document.querySelector(`.${this.id}-options`)?.remove();
                document
                    .querySelector(".data-board")
                    ?.querySelector(`#${this.id}`)
                    ?.insertAdjacentElement("afterend", this.createOptions());
            },
            value: this.datatype,
        });
        dataType.appendChild(dropdown.build());

        div.appendChild(dataType);

        const valueContainer = document.createElement("div");
        valueContainer.classList.add("data-board-variable-value-container");
        const label = document.createElement("div");
        label.innerText = "value";
        label.style.paddingTop = "10px";
        label.style.paddingBottom = "10px";
        valueContainer.appendChild(label);

        const input = document.createElement("input");
        input.classList.add("data-board-variable-input");
        input.type =
            this.datatype === "boolean"
                ? "checkbox"
                : this.datatype === "number"
                ? "number"
                : "text";
        input.placeholder = "enter value";
        input.value = this.value;
        input.onchange = () => {
            this.value = input.value;
        };
        valueContainer.appendChild(input);

        div.appendChild(valueContainer);

        return div;
    }

    @bind
    toggleOpen() {
        this.open = !this.open;
        this.rebuild();
        if (this.open) {
            document
                .querySelector(".data-board")
                ?.querySelector(`#${this.id}`)
                ?.insertAdjacentElement("afterend", this.createOptions());
        } else {
            document
                .querySelector(".data-board")
                ?.querySelector(`#${this.id}`)
                ?.nextSibling?.remove();
        }
    }

    rebuild() {
        document
            .querySelector(".data-board")
            ?.querySelector(`#${this.id}`)
            ?.replaceWith(this.build());
    }
}
