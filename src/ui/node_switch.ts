// TODO : this ui element is under development and is not used yet in the project but will be used in the future

import {
    fastSwitch,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";

provideFASTDesignSystem().withPrefix("wires").register(fastSwitch({}));

export class NodeSwitch extends UIElement {
    constructor(public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }

    build() {
        let e = document.createElement("wires-switch");
        e.style.marginTop = "7px";
        e.style.marginBottom = "7px";
        e.classList.add("node-switch-container");
        e.innerText = "Switch";
        return e;
    }

    // //         <fast-switch>
    //     Theme
    //     <span slot="checked-message">Dark</span>
    //     <span slot="unchecked-message">Light</span>
    // </fast-switch>
}
