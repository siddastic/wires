import { NodeUI } from "../../ui/node";
import { bind } from "../decorators";
import { DraggableUIElement } from "../draggable_ui_element";
import { WireGraph } from "../graph/wire_graph";

export abstract class WireNode {
    nodeUi: NodeUI;
    nodeId = globalThis.uniqueIdGenerator.create();

    static doc() {
        throw new Error(
            "Documentation is not implemented for node type: " + this.name
        );
    }

    constructor(
        public positionInWorld: Vector2,
        public graphInstance: WireGraph
    ) {
        this.nodeUi = this.createNodeUI();
    }

    @bind
    onDragStart(position: Vector2) {}

    @bind
    onDrag(dragEvent: MouseEvent) {
        // this.updateConnectedPathsOnDrag();
    }

    @bind
    onDragEnd(position: Vector2) {}

    private createNodeUI(): NodeUI {
        // create node UI
        var node = new NodeUI(this.nodeId, "Node");
        this.graphInstance.elementTree.nodeContainer.appendChild(
            node.nodeElement
        );


        // make node draggable
        new DraggableUIElement(
            node.nodeElement,
            (pos, dragEvent) => {
                this.positionInWorld = pos;
                this.onDrag(dragEvent);
            },
            this.onDragStart,
            this.onDragEnd,
            node.header,
        );


        return node;
        
    }
}

export class VariableNode extends WireNode {
    build() {
        // throw new Error("Method not implemented.");
    }
}
