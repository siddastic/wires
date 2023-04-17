import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";

import "../styles/ui/node_connector.css";

export interface NodeConnectorData{
    direction: "input" | "output";
}

export class NodeConnector extends UIElement {
    connectorColors = [
        "#FF8B8B",
        "#99EF91",
        "#FBCBF4",
        "#83E4E7",
        "#F6FF9A",
    ];
    constructor(public data : NodeConnectorData,public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }
    protected build(): HTMLElement {
        const connector = document.createElement("div");
        connector.classList.add("node-connector");
        if(this.data.direction == "output"){
            connector.classList.add("node-connector-right");
        }
        connector.style.border = `1px solid ${
            this.connectorColors[
                Math.floor(Math.random() * this.connectorColors.length)
            ]
        }`;

        return connector;
    }
}
