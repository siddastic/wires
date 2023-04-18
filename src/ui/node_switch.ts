// TODO : this ui element is under development and is not used yet in the project but will be used in the future

import {
    fastSwitch,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";
import "../styles/ui/node_switch.css";

provideFASTDesignSystem().withPrefix("wires").register(fastSwitch());

export interface NodeSwitchData {
    label: string;
    value?: boolean;
    onChange?: (newValue: boolean) => void;
}

export class NodeSwitch extends UIElement {
    constructor(private data: NodeSwitchData, public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }

    protected build() {
        let container = document.createElement("div");
        container.id = this.id;
        container.classList.add("node-switch-container");

        let label = this.buildLabel();
        let switchElement = this.buildSwitch();

        container.appendChild(label);
        container.appendChild(switchElement);
        return container;
    }

    protected buildLabel() {
        let label = document.createElement("div");
        label.classList.add("node-switch-label");
        label.innerText = this.data.label;
        return label;
    }

    protected buildSwitch() {
        // force the type to be HTMLInputElement so that we can use the checked property
        let switchElement = document.createElement("wires-switch") as unknown as HTMLInputElement;
        switchElement.setAttribute(
            "checked",
            (this.data.value ?? false).toString()
        );

        if (this.data.onChange !== undefined) {
            switchElement.addEventListener("change", () => {
                this.data.onChange!(
                    switchElement.checked
                );
            });
        }
        return switchElement;
    }
}
