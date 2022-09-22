import './styles/main.css';
import { HTML } from './tags/html';





const node = new HTML();

document.body.appendChild(node.node.element);
console.log(node);