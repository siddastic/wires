import './styles/main.css';
import { HTML } from './tags/html';





const node = new HTML();
const node2 = new HTML();

document.body.appendChild(node.node.element);
document.body.appendChild(node2.node.element);
console.log(node);