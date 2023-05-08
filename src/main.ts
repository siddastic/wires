import { bind } from "./api/decorators";
import { DraggableUIElement } from "./api/draggable_ui_element";
import { GraphBackground } from "./api/graph/graph_background";
import { GraphContainer } from "./api/graph/graph_container";
import { NodeManager } from "./api/graph/node_manager";
import { NodeSelectionManager } from "./api/graph/node_selection_manager";
import { DefaultGraphTheme, Theme } from "./api/graph/theme";
import { WireGraph } from "./api/graph/wire_graph";
import { VariableNode, WireNode } from "./api/node/wire_node";
import { StatusBar, StatusBarAlignment, StatusBarItemData } from "./api/status-bar";
import { UniqueIdGenerator } from "./api/uid";
import { Vector2 } from "./interfaces/basics";
import { GraphOptions } from "./interfaces/graph";
import { NodeButton, NodeButtonData } from "./ui/node_button";
import { NodeConnector, NodeConnectorData, NodeConnectorStyle } from "./ui/node_connector";
import { NodeDropdown, NodeDropdownData } from "./ui/node_dropdown";
import { NodeField, NodeFieldData, NodeFieldType } from "./ui/node_field";
import { NodeSwitch, NodeSwitchData } from "./ui/node_switch";
import { NodeUI } from "./ui/node_ui";
import { UIElement } from "./ui/ui_element";

declare global {
    var graph: WireGraph;
}
const graph = new WireGraph(document.querySelector(".graph") as HTMLDivElement,{
    showGridEnabled: true,
});
window.graph = graph;
graph.nodeManager.addAvailableNode(VariableNode);
// TODO : add exports in entry file so that they can be imported from other packages
export {
    WireGraph,
    GraphBackground,
    GraphContainer,
    NodeManager,
    NodeSelectionManager,
    WireNode,
    // remove variable node
    VariableNode,
    DefaultGraphTheme,
    StatusBar,
    StatusBarAlignment,
    DraggableUIElement,
    bind,
    UIElement,
    NodeUI,
    NodeButton,
    NodeConnector,
    NodeDropdown,
    NodeField,
    NodeSwitch,
    UniqueIdGenerator,
};
export type {
    Theme,
    NodeSwitchData,
    NodeFieldType,
    NodeFieldData,
    NodeDropdownData,
    NodeConnectorData,
    NodeConnectorStyle,
    NodeButtonData,
    StatusBarItemData,
    Vector2,
    GraphOptions,
};
