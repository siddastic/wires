import {
    fastListbox,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import "../styles/plugins/status-bar.css";

provideFASTDesignSystem().withPrefix("wires").register(fastListbox());

export enum StatusBarAlignment {
    left,
    right,
}

interface StatusBarItemData {
    label: string;
    alignment: StatusBarAlignment;
    iconClass?: string;
    onClick?: Function;
    options?: string[];
    onOptionSelect?: (selectedOption: string) => void;
}

export class StatusBar {
    element: HTMLElement;
    leftContainer!: HTMLElement;
    rightContainer!: HTMLElement;

    items: StatusBarItem[] = [];
    constructor() {
        this.element = this.createStatusBarItem();
    }
    private createStatusBarItem() {
        let statusBar = document.createElement("div");
        this.leftContainer = document.createElement("div");
        this.rightContainer = document.createElement("div");

        this.leftContainer.classList.add("status-bar-left");
        this.rightContainer.classList.add("status-bar-right");

        statusBar.appendChild(this.leftContainer);
        statusBar.appendChild(this.rightContainer);
        statusBar.classList.add("status-bar");
        document.body.appendChild(statusBar);
        return statusBar;
    }

    public addStatusBarItem(itemData: StatusBarItemData) {
        let item = new StatusBarItem(itemData);
        if (itemData.alignment === StatusBarAlignment.left) {
            this.leftContainer.appendChild(item.build());
        } else {
            this.rightContainer.appendChild(item.build());
        }
        this.items.push(item);
        return item;
    }

    public removeStatusBarItem(item: StatusBarItem) {
        let index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        item.rootElement.remove();
    }
}

class StatusBarItem {
    id: string = uniqueIdGenerator.create();
    labelElement!: HTMLSpanElement;
    isVisible: boolean = true;
    rootElement!: HTMLElement;
    optionsListbox?: HTMLElement;
    optionsListboxVisible: boolean = false;
    constructor(public data: StatusBarItemData) {}
    build(): HTMLElement {
        let item = document.createElement("div");
        let innerContainer = document.createElement("div");
        innerContainer.classList.add("status-bar-item-container");
        item.classList.add("status-bar-item");
        if (this.data.iconClass) {
            let icon = document.createElement("span");
            icon.classList.add("status-bar-icon");
            icon.classList.add(...this.data.iconClass.split(" "));
            innerContainer.appendChild(icon);
        }
        this.labelElement = document.createElement("span");
        this.labelElement.innerText = this.data.label;
        if (this.data.options !== undefined && this.data.options.length > 0) {
            this.optionsListbox = this.buildOptionsListbox();
        }
        item.addEventListener("click", () => {
            if (this.data.onClick) {
                this.data.onClick();
            }
            if (
                this.data.options !== undefined &&
                this.data.options.length > 0
            ) {
                if (this.optionsListboxVisible) {
                    this.hideOptionsListbox();
                } else {
                    this.showOptionsListbox();
                }
            }
        });

        if (this.optionsListbox) {
            item.appendChild(this.optionsListbox);
        }
        innerContainer.appendChild(this.labelElement);
        item.appendChild(innerContainer);
        this.rootElement = item;
        return item;
    }

    public showOptionsListbox() {
        this.optionsListbox!.style.display = "inline-flex";
        this.optionsListboxVisible = true;
    }

    public hideOptionsListbox() {
        this.optionsListbox!.style.display = "none";
        this.optionsListboxVisible = false;
    }

    setLabel(label: string, transitionValueUpdate?: boolean) {
        if (this.labelElement.innerText === label) {
            return;
        }
        if (transitionValueUpdate) {
            this.toggleHighlight();

            setTimeout(() => {
                this.toggleHighlight();
            }, 600);
        }

        this.data.label = label;
        this.labelElement.innerText = label;
    }

    protected buildOptionsListbox() {
        let listbox = document.createElement("wires-listbox");
        listbox.setAttribute("appearance", "filled");
        listbox.style.display = "none";
        for (let option of this.data.options!) {
            let optionElement = document.createElement("wires-option");
            optionElement.setAttribute("value", option);
            optionElement.innerText = option;
            optionElement.addEventListener("click", () => {
                if (this.data.onOptionSelect) {
                    this.data.onOptionSelect(option);
                }
            });
            listbox.appendChild(optionElement);
        }
        return listbox;
    }

    hide() {
        this.isVisible = false;
        this.rootElement.style.display = "none";
    }

    show() {
        this.isVisible = true;
        this.rootElement.style.display = "inline-block";
    }

    toggleHighlight() {
        this.rootElement.classList.toggle("highlight");
    }
}
