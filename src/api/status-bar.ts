import "../styles/ui/status-bar.css";

export enum StatusBarAlignment {
    left,
    right,
}

interface StatusBarItemData {
    text: string;
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
        let item = document.createElement("div");
        let innerContainer = document.createElement("div");
        innerContainer.classList.add("status-bar-item-container");
        item.classList.add("status-bar-item");
        if (itemData.iconClass) {
            let icon = document.createElement("span");
            icon.classList.add("status-bar-icon");
            icon.classList.add(...itemData.iconClass.split(" "));
            innerContainer.appendChild(icon);
        }
        let label = document.createElement("span");
        label.innerText = itemData.text;
        item.addEventListener("click", () => {
            if (itemData.onClick) {
                itemData.onClick();
            }
        });
        if (itemData.alignment === StatusBarAlignment.left) {
            this.leftContainer.appendChild(item);
        } else {
            this.rightContainer.appendChild(item);
        }
        innerContainer.appendChild(label);
        item.appendChild(innerContainer);
        return item;
    }
}
