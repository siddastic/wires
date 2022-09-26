import { GlobalNodeRegistry } from './api/global_node_registry';
import { GraphNodeExplorer } from './api/node_explorer';
import { Vector2 } from './interfaces/node';
import './styles/main.css';
import { Head, HTML } from './tags/tags';



const GlobalNodesRepository = [
    HTML,
    Head,
];

console.log(GlobalNodesRepository);

const searchExplorer = new GraphNodeExplorer(
    Array(500).fill(0).map((_, i) => {
        if(i % 2 == 0) {
            return HTML;
        }
        else {
            return Head;
        }
    }),
);

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();

    const instancePoint: Vector2 = { x: event.x, y: event.y };
    const tag = new GlobalNodesRepository[0](instancePoint);
    document.body.appendChild(tag.node.element);
})

window.onkeydown = (k) => {
    if (k.which == 32 && k.ctrlKey) {
        searchExplorer.toggleExplorer();
        document.querySelector(".explorer-container")?.querySelector("input")?.focus();
    }
};

const globalNodeRegistry = new GlobalNodeRegistry();

declare global {
    var globalNodeRegistry : GlobalNodeRegistry;
}

// @ts-ignore
globalThis.globalNodeRegistry = globalNodeRegistry;