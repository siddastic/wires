import { Vector2 } from "../interfaces/node";
import { bind } from "./decorators";
import { WireNode } from "./wire_node";

export class GraphNodeExplorer {
    visible: boolean = false;
    private currentExpContainerElement?: HTMLDivElement;
    availableWireNodes: Array<typeof WireNode>;
    menuSpawnLocation: Vector2 = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
    currentSelectedNodeIndex: number = 0;
    constructor(private hostElement: HTMLElement) {
        this.availableWireNodes = globalThis.globalNodeRegistry.availableNodes;
    }

    createNode(node: typeof WireNode) {
        const instancePoint: Vector2 = this.menuSpawnLocation;
        // @ts-ignore
        const tag: WireNode = new node(instancePoint);
        tag.setupNode();
        this.hostElement.appendChild(tag.node.element);

        this.toggleExplorer();
    }

    // createDocumentationViewer() {
    //     const explorerContainer = document.querySelector(
    //         ".explorer-container"
    //     ) as HTMLDivElement;
    //     const docViewer = document.createElement("div");
    //     docViewer.classList.add("doc-viewer");
    //     explorerContainer
    //         .querySelector(".centered-view")
    //         ?.appendChild(docViewer);
    // }

    @bind
    addKeyboardNavigation({ key }: KeyboardEvent) {
        if (key === "ArrowDown") {
            if (
                this.currentSelectedNodeIndex <
                this.availableWireNodes.length - 1
            ) {
                this.currentSelectedNodeIndex++;
            } else if (
                this.currentSelectedNodeIndex ===
                this.availableWireNodes.length - 1
            ) {
                this.currentSelectedNodeIndex = 0;
            }
        } else if (key === "ArrowUp") {
            if (this.currentSelectedNodeIndex > 0) {
                this.currentSelectedNodeIndex--;
            } else if (this.currentSelectedNodeIndex === 0) {
                this.currentSelectedNodeIndex =
                    this.availableWireNodes.length - 1;
            }
        } else if (key === "Enter") {
            let selectedElement = this.currentExpContainerElement
                ?.querySelector(".node-items")
                ?.querySelector<HTMLDivElement>(".list-tile:is(.selected)");
            selectedElement?.click();
        }
        this.updateSelectedNode();
    }

    @bind
    updateSelectedNode() {
        var filteredElements: Array<Element> = [];
        this.currentExpContainerElement
            ?.querySelector(".node-items")
            ?.querySelectorAll(".list-tile")
            .forEach((elem, index) => {
                elem.classList.remove("selected");
                if (getComputedStyle(elem).display === "none") {
                    return;
                }
                filteredElements.push(elem);
            });

        filteredElements.forEach((elem, index) => {
            if (index === this.currentSelectedNodeIndex) {
                if (!elem.classList.contains("selected")) {
                    elem.classList.add("selected");
                }
            } else {
                elem.classList.remove("selected");
            }
        });
    }

    toggleExplorer() {
        if (!this.visible) {
            const explorerContainer = document.createElement("div");
            explorerContainer.classList.add("explorer-container");
            this.currentExpContainerElement = explorerContainer;
            explorerContainer.addEventListener("click", this.onContainerClick);
            // const centeredView = document.createElement("div");
            // centeredView.classList.add("centered-view");
            const nodeExplorer = document.createElement("div");
            nodeExplorer.classList.add("node-explorer");
            nodeExplorer.style.top = `${this.menuSpawnLocation.y}px`;
            nodeExplorer.style.left = `${this.menuSpawnLocation.x}px`;
            const header = document.createElement("div");
            header.classList.add("header");
            header.innerText = "Search Nodes";
            const input = document.createElement("input");
            input.type = "text";
            input.oninput = this.onSearchInput;
            const nodeItems = document.createElement("div");
            nodeItems.classList.add("node-items");
            const tiles: Node[] = [];
            for (let i of this.availableWireNodes) {
                const listTile = document.createElement("div");
                listTile.classList.add("list-tile");
                listTile.title = i.doc().desc ?? "No documentation";
                const leading = document.createElement("div");
                leading.classList.add("leading");
                leading.classList.add("codicon");
                leading.classList.add("codicon-symbol-property");
                const title = document.createElement("div");
                title.classList.add("title");
                title.innerText = i.doc().name;
                const trailing = document.createElement("div");
                trailing.classList.add("trailing");
                trailing.innerText = "tag";

                listTile.appendChild(leading);
                listTile.appendChild(title);
                listTile.appendChild(trailing);

                listTile.onclick = () => {
                    this.createNode(i);
                };

                tiles.push(listTile);
            }

            nodeItems.append(...tiles);
            nodeExplorer.appendChild(header);
            nodeExplorer.appendChild(input);
            nodeExplorer.appendChild(nodeItems);
            // centeredView.appendChild(nodeExplorer);
            // explorerContainer.appendChild(centeredView);
            explorerContainer.appendChild(nodeExplorer);
            this.hostElement.appendChild(explorerContainer);
            this.visible = true;
            document
                .querySelector(".explorer-container")
                ?.querySelector("input")
                ?.focus();
            // this.createDocumentationViewer();
            input.addEventListener("keydown", this.addKeyboardNavigation);
            this.currentSelectedNodeIndex = 0;
            this.updateSelectedNode();
        } else {
            document.querySelector(".explorer-container")?.remove();
            this.visible = false;
        }
    }

    @bind
    onSearchInput(e: Event) {
        const input = e.target as HTMLInputElement;
        const tiles = document
            .querySelector(".explorer-container")!
            .querySelectorAll<HTMLDivElement>(".list-tile");
        this.currentSelectedNodeIndex = 0;
        this.updateSelectedNode();
        tiles.forEach((tile) => {
            const title = tile.querySelector(".title") as HTMLDivElement;
            if (
                title.innerText
                    .toLowerCase()
                    .includes(input.value.toLowerCase())
            ) {
                tile.style.display = "flex";
            } else {
                tile.style.display = "none";
            }
        });
    }

    @bind
    private onContainerClick(e: MouseEvent) {
        // @ts-ignore
        if (e.target!.classList.contains("explorer-container")) {
            this.currentExpContainerElement?.remove();
            this.visible = false;
        }
    }
}
