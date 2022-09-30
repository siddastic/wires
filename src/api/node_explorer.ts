import { Vector2 } from "../interfaces/node";
import { bind } from "./decorators";
import { WireNode } from "./wire_node";

export class GraphNodeExplorer {
  visible: boolean = false;
  private currentExpContainerElement? : HTMLDivElement;
  availableWireNodes: Array<typeof WireNode>;
  constructor() {
    this.availableWireNodes = globalThis.globalNodeRegistry.availableNodes;
  }

  createNode(node : typeof WireNode){
    const instancePoint: Vector2 = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // @ts-ignore
    const tag = new node(instancePoint);
    tag.setupNode();
    document.body.appendChild(tag.node.element);
  }

  toggleExplorer() {
    if (!this.visible) {
      const explorerContainer = document.createElement("div");
      explorerContainer.classList.add("explorer-container");
      this.currentExpContainerElement = explorerContainer;
      explorerContainer.addEventListener('click', this.onContainerClick);
      const nodeExplorer = document.createElement("div");
      nodeExplorer.classList.add("node-explorer");
      const header = document.createElement("div");
      header.classList.add("header");
      header.innerText = "Search Nodes";
      const input = document.createElement("input");
      input.type = "text";
      const nodeItems = document.createElement("div");
      nodeItems.classList.add("node-items");
      const tiles: Node[] = [];
      for (let i of this.availableWireNodes) {
        const listTile = document.createElement("div");
        listTile.classList.add("list-tile");
        listTile.title = i.doc().documentation ?? "No documentation";
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
      explorerContainer.appendChild(nodeExplorer);
      document.body.appendChild(explorerContainer);
      this.visible = true;
    }
    else {
      document.querySelector('.explorer-container')?.remove();
      this.visible = false;
    }
  }

  @bind
  private onContainerClick(e: MouseEvent) {
    // @ts-ignore
    if (e.target!.classList.contains('explorer-container')) {
      this.currentExpContainerElement?.remove();
      this.visible = false;
    }
  }
}