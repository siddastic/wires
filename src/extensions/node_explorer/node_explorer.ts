import { bind } from "../../api/decorators";
import { GraphExtension } from "../../api/extension/graphExtension";
import { GraphBackground } from "../../api/graph/graph_background";
import { GraphContainer } from "../../api/graph/graph_container";
import { WireGraph } from "../../api/graph/wire_graph";
import { Vector } from "../../api/vector_operations";
import { Vector2 } from "../../interfaces/basics";
import { UIElement } from "../../ui/ui_element";

import "./node_explorer.css";

interface ExplorerBodyListTileData {
    icon: string;
    title: string;
    iconColor: string;
    onClick?: () => void;
}

export class NodeExplorer extends GraphExtension {
    id = "graph-node-explorer";
    ui: ExplorerUI = new ExplorerUI(this.graphInstance);
    lastSpawnInstancePoint: Vector2 = { x: 0, y: 0 };

    activate(): void {
        this.graphInstance.rootGraph.appendChild(this.ui.element);
        window.addEventListener(
            "contextmenu",
            this.toggleExplorerOnContextMenu
        );

        window.addEventListener("keydown", this.toggleExplorerOnKeydown);

        this.ui.container.addEventListener("click", this.hideExplorerOnBackgroundClick);

        this.ui.body.searchInput.addEventListener(
            "input",
            this.onSearchInputChanged
        );

        // hide by default
        this.ui.hide();
    }

    @bind
    toggleExplorerOnContextMenu(event: MouseEvent): void {
        event.preventDefault();
        if (
            GraphBackground.wasEventStartedOnBackground(event) ||
            GraphContainer.wasEventStartedOnContainer(event) ||
            GraphContainer.wasEventStartedOnNodeContainer(event)
        ) {
            this.graphInstance.nodeManager.nodeSelectionManager.deselectAllNodes();
            const instancePoint: Vector2 = { x: event.x, y: event.y };

            this.lastSpawnInstancePoint = instancePoint;
            this.ui.show();
            this.populateExplorerList();
            this.ui.body.searchInput.focus();
        } else {
            this.ui.visible ? this.ui.hide() : null;
        }
    }

    @bind
    toggleExplorerOnKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.ui.visible ? this.ui.hide() : null;
            return;
        }

        if (event.code === "Space") {
            if (event.ctrlKey) {
                this.ui.toggleVisibility();
                this.populateExplorerList();
                this.ui.body.searchInput.focus();
            }
        }
    }

    @bind
    populateExplorerList(nameFilter?: string): void {
        // clear the list
        this.ui.body.bodyList.innerHTML = "";

        // populate the list
        Array.from(this.graphInstance.nodeManager.availableNodes).forEach(
            (node) => {
                let doc = node.doc();
                var expBody = this.ui.body;
                let tile = expBody.buildBodyListTile({
                    icon: doc.icon ?? "codicon codicon-misc",
                    title: doc.name,
                    iconColor: doc.iconColor ?? "white",
                    onClick: () => {
                        this.graphInstance.nodeManager.spawnNode(
                            node,
                            Vector.subtract(
                                this.lastSpawnInstancePoint,
                                this.graphInstance.graphContainer.transform
                            )
                        );
                        this.ui.hide();
                    },
                });

                if (nameFilter) {
                    if (
                        doc.name
                            .toLowerCase()
                            .startsWith(nameFilter.toLowerCase())
                    ) {
                        expBody.bodyList.appendChild(tile);
                    }
                } else {
                    expBody.bodyList.appendChild(tile);
                }
            }
        );
    }

    @bind
    onSearchInputChanged(event: Event): void {
        let target = event.target as HTMLInputElement;
        this.populateExplorerList(
            target.value.length > 0 ? target.value : undefined
        );
    }

    @bind
    hideExplorerOnBackgroundClick(event: MouseEvent): void {
        if (event.target === this.ui.container) {
            this.ui.hide();
        }
    }

    deactivate(): void {
        this.ui.destroy();
        window.removeEventListener(
            "contextmenu",
            this.toggleExplorerOnContextMenu
        );
        window.removeEventListener("keydown", this.toggleExplorerOnKeydown);
        this.ui.body.searchInput.removeEventListener(
            "input",
            this.onSearchInputChanged
        );
    }
}

class ExplorerUI extends UIElement {
    container!: HTMLDivElement;
    modal!: HTMLDivElement;
    body!: ExplorerBody;
    constructor(graphInstance: WireGraph) {
        super(graphInstance);

        this.element = this.build();
    }

    private buildContainer() {
        let explorerContainer = document.createElement("div");
        explorerContainer.classList.add("explorer-container");
        this.container = explorerContainer;
        return explorerContainer;
    }

    private buildModal() {
        let modal = document.createElement("div");
        modal.classList.add("explorer-modal");

        this.modal = modal;
        return modal;
    }

    protected build() {
        let container = this.buildContainer();
        let modal = this.buildModal();
        this.body = new ExplorerBody(this.graphInstance);

        modal.appendChild(this.body.element);
        container.appendChild(modal);
        return container;
    }

    destroy(): void {
        this.element.remove();
    }
}

class ExplorerBody extends UIElement {
    searchInput!: HTMLInputElement;
    bodyList!: HTMLUListElement;
    constructor(public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }

    private buildSearchBar() {
        let searchBar = document.createElement("div");
        searchBar.classList.add("explorer-search-bar");

        let searchForm = document.createElement("form");
        searchForm.method = "dialog";
        searchForm.classList.add("explorer-search-form");

        let searchIcon = document.createElement("label");
        searchIcon.setAttribute("for", "explorer-search-input");
        searchIcon.classList.add("explorer-search-icon");
        searchIcon.classList.add(..."codicon codicon-search".split(" "));

        let searchInput = document.createElement("input");
        searchInput.id = "explorer-search-input";
        searchInput.classList.add("explorer-search-input");
        searchInput.type = "text";
        // limit the search input to 64 characters
        searchInput.maxLength = 64;
        searchInput.placeholder = "Search Nodes";
        this.searchInput = searchInput;

        searchForm.appendChild(searchIcon);
        searchForm.appendChild(searchInput);
        searchBar.appendChild(searchForm);
        return searchBar;
    }

    private buildBody() {
        let body = document.createElement("div");
        body.classList.add("explorer-body");

        let bodyList = document.createElement("ul");
        bodyList.classList.add("explorer-body-list");
        bodyList.role = "listbox";
        this.bodyList = bodyList;

        body.appendChild(bodyList);
        return body;
    }

    buildBodyListTile(data: ExplorerBodyListTileData) {
        let bodyListTile = document.createElement("li");
        bodyListTile.classList.add("explorer-body-list-tile");

        let bodyListTileIcon = document.createElement("span");
        bodyListTileIcon.classList.add("explorer-body-list-tile-icon");
        bodyListTileIcon.classList.add(...data.icon.split(" "));
        bodyListTileIcon.style.color = data.iconColor;

        let bodyListTileLabel = document.createElement("div");
        bodyListTileLabel.classList.add("explorer-body-list-tile-label");
        bodyListTileLabel.innerText = data.title;

        bodyListTile.appendChild(bodyListTileIcon);
        bodyListTile.appendChild(bodyListTileLabel);

        if (data.onClick) {
            bodyListTile.addEventListener("click", data.onClick);
        }
        return bodyListTile;
    }

    private buildFooter() {
        let footer = document.createElement("div");
        footer.classList.add("explorer-footer");

        let footerLabel = document.createElement("div");
        footerLabel.classList.add("explorer-footer-label");
        footerLabel.innerText = "Node Explorer";

        let footerCommands = document.createElement("ul");
        footerCommands.classList.add("explorer-footer-commands");

        footerCommands.appendChild(
            this.buildFooterCommand("codicon codicon-newline", "to select")
        );

        let arrowDown = this.buildFooterCommand("codicon codicon-arrow-down");
        arrowDown.style.marginRight = "unset";
        footerCommands.appendChild(arrowDown);

        footerCommands.appendChild(
            this.buildFooterCommand("codicon codicon-arrow-up", "to navigate")
        );

        footer.appendChild(footerLabel);
        footer.appendChild(footerCommands);
        return footer;
    }

    buildFooterCommand(commandIcon: string, commandName?: string) {
        let command = document.createElement("li");
        command.classList.add("explorer-footer-command");

        let commandKey = document.createElement("span");
        commandKey.classList.add("explorer-footer-command-key");

        let commandIconElement = document.createElement("span");
        commandIconElement.classList.add(...commandIcon.split(" "));
        commandIconElement.style.fontSize = "12px";

        commandKey.appendChild(commandIconElement);
        command.appendChild(commandKey);

        if (commandName !== undefined) {
            let commandLabel = document.createElement("span");
            commandLabel.classList.add("explorer-footer-command-label");
            commandLabel.innerText = commandName;

            command.appendChild(commandLabel);
        }

        return command;
    }

    build() {
        let explorer = document.createElement("div");
        explorer.classList.add("explorer");

        explorer.appendChild(this.buildSearchBar());
        explorer.appendChild(this.buildBody());
        explorer.appendChild(this.buildFooter());
        return explorer;
    }
}
