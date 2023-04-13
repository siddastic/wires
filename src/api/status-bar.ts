import "../styles/plugins/status-bar.css";

export enum StatusBarAlignment {
    left,
    right,
}

interface StatusBarItemData {
    label: string;
    alignment: StatusBarAlignment;
    iconClass?: string;
    onClick?: Function;
}

export class StatusBar {
    element: HTMLElement;
    leftContainer!: HTMLElement;
    rightContainer!: HTMLElement;
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
        return item;
    }
}

class StatusBarItem {
    id: string = uniqueIdGenerator.create();
    labelElement!: HTMLSpanElement;
    isVisible: boolean = true;
    rootElement!: HTMLElement;
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
        item.addEventListener("click", () => {
            if (this.data.onClick) {
                this.data.onClick();
            }
        });
        innerContainer.appendChild(this.labelElement);
        item.appendChild(innerContainer);
        this.rootElement = item;
        return item;
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
