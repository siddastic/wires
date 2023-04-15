// TODO : this ui element is under development and is not used yet in the project but will be used in the future

import {
    fastSwitch,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";
import "../styles/ui/node_switch.css";

provideFASTDesignSystem().withPrefix("wires").register(fastSwitch({}));

export interface NodeSwitchData{
    label: string;
}

export class NodeSwitch extends UIElement {
    constructor(public data : NodeSwitchData,public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }

    build() {
        let container = document.createElement("div");
        container.id = this.id;
        container.classList.add("node-switch-container");

        let label = this.buildLabel();
        let switchElement = this.buildSwitch();

        container.appendChild(label);
        container.appendChild(switchElement);
        return container;
    }

    private buildLabel(){
        let label = document.createElement("div");
        label.classList.add("node-switch-label");
        label.innerText = this.data.label;
        return label;
    }

    private buildSwitch(){
        let switchElement = document.createElement("wires-switch");
        return switchElement;
    }
        

    // //         <fast-switch>
    //     Theme
    //     <span slot="checked-message">Dark</span>
    //     <span slot="unchecked-message">Light</span>
    // </fast-switch>
}
