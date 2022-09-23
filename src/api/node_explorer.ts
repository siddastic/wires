import { WireNode } from "./wire_node";

export class GraphNodeExplorer {
  public nodes: Array<WireNode> = [];
  visible: boolean = false;
  constructor() { }

  toggleExplorer() {
    if (!this.visible) {
      const explorerContainer = document.createElement("div");
      explorerContainer.classList.add("explorer-container");

      explorerContainer.onclick = (e) => {
        // @ts-ignore
        if(e.target!.classList.contains('explorer-container')){
          explorerContainer.remove();
          this.visible = false;
        }
      };
      const nodeExplorer = document.createElement("div");
      nodeExplorer.classList.add("node-explorer");
      const header = document.createElement("div");
      header.classList.add("header");
      header.innerText = "Search Nodes";
      const input = document.createElement("input");
      input.type = "text";
      const nodeItems = document.createElement("div");
      nodeItems.classList.add("node-items");
      const listTile = document.createElement("div");
      listTile.classList.add("list-tile");
      const leading = document.createElement("div");
      leading.classList.add("leading");
      leading.classList.add("codicon");
      leading.classList.add("codicon-symbol-property");
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = "HTML";
      const trailing = document.createElement("div");
      trailing.classList.add("trailing");
      trailing.innerText = "s";

      listTile.appendChild(leading);
      listTile.appendChild(title);
      listTile.appendChild(trailing);
      nodeItems.appendChild(listTile);
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
}