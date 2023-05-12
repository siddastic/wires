import { bind, doc } from "./api/decorators";
import { DraggableUIElement } from "./api/draggable_ui_element";
import { ExtensionState, GraphExtension } from "./api/extension/graphExtension";
import { ExtensionManager } from "./api/extension/plugin_manager";
import { GraphBackground } from "./api/graph/graph_background";
import { GraphContainer } from "./api/graph/graph_container";
import { NodeManager } from "./api/graph/node_manager";
import { NodeSelectionManager } from "./api/graph/node_selection_manager";
import { DefaultGraphTheme, Theme } from "./api/graph/theme";
import { WireGraph } from "./api/graph/wire_graph";
import { GlobalNodeTree, NodeMetadata } from "./api/node/global_node_tree";
import {
    AddNode,
    MultiplyNode,
    PowerNode,
    SubtractNode,
    VariableNode,
    WireNode,
} from "./api/node/wire_node";
import { UniqueIdGenerator } from "./api/uid";
import { Vector } from "./api/vector_operations";
import { GraphMinimap } from "./extensions/graph_minimap/graph_minimap";
import { NodeExplorer } from "./extensions/node_explorer/node_explorer";
import {
    StatusBar,
    StatusBarAlignment,
    StatusBarItemData,
} from "./extensions/status_bar/status-bar";
import { Vector2 } from "./interfaces/basics";
import { GraphOptions } from "./interfaces/graph";
import { NodeDocumentation } from "./interfaces/node";
import { NodeButton, NodeButtonData } from "./ui/node_button";
import {
    NodeConnector,
    NodeConnectorData,
    NodeConnectorStyle,
} from "./ui/node_connector";
import { NodeDropdown, NodeDropdownData } from "./ui/node_dropdown";
import { NodeField, NodeFieldData, NodeFieldType } from "./ui/node_field";
import { NodeSwitch, NodeSwitchData } from "./ui/node_switch";
import { NodeUI } from "./ui/node_ui";
import { UIElement } from "./ui/ui_element";

// declare global {
//     var graph: WireGraph;
// }
// const graph = new WireGraph(
//     document.querySelector(".graph") as HTMLDivElement,
//     {
//         showGridEnabled: true,
//     }
// );
// window.graph = graph;
// graph.nodeManager.addAvailableNode(VariableNode);
// graph.nodeManager.addAvailableNode(AddNode);
// graph.nodeManager.addAvailableNode(SubtractNode);
// graph.nodeManager.addAvailableNode(MultiplyNode);
// graph.nodeManager.addAvailableNode(PowerNode);


// // init default graph extensions
// graph.extensionManager.useExtension(StatusBar);
// graph.extensionManager.useExtension(NodeExplorer);
// graph.extensionManager.useExtension(GraphMinimap);
// TODO : add exports in entry file so that they can be imported from other packages
export {
    WireGraph,
    GraphBackground,
    GraphContainer,
    NodeManager,
    NodeSelectionManager,
    WireNode,
    DefaultGraphTheme,
    DraggableUIElement,
    bind,
    doc,
    UIElement,
    NodeUI,
    NodeButton,
    NodeConnector,
    NodeDropdown,
    NodeField,
    NodeSwitch,
    UniqueIdGenerator,
    Vector,
    GlobalNodeTree,
    ExtensionManager,
    GraphExtension,
    StatusBarAlignment,
    ExtensionState,
    // Prebuilt Nodes
    VariableNode,
    AddNode,
    SubtractNode,
    MultiplyNode,
    PowerNode,
    
    // Extensions
    GraphMinimap,
    NodeExplorer,
    StatusBar
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
    NodeMetadata,
    NodeDocumentation,
};
