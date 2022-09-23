import { GraphNodeExplorer } from './api/node_explorer';
import { Vector2 } from './interfaces/vector_2';
import './styles/main.css';
import { HTML, Head } from './tags/tags';



const GlobalNodesRepository = [
    HTML,
    Head,
];

const searchExplorer = new GraphNodeExplorer();

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