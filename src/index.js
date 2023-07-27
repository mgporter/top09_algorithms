import './basestyle.css';
import './style.css';
import LinkedList from './linkedList';
import CanvasController from './canvasController';
import DomRenderer from './domRenderer';

function Controls() {
  const list = LinkedList();
  const canCon = CanvasController(list);
  const options = DomRenderer();

  const newListBtn = document.getElementById('newlistbtn');
  const appendBtn = document.getElementById('appendbtn');
  const prependBtn = document.getElementById('prependbtn');
  const headBtn = document.getElementById('headbtn');
  const tailBtn = document.getElementById('tailbtn');
  const popBtn = document.getElementById('popbtn');
  const sizeBtn = document.getElementById('sizebtn');
  const containsBtn = document.getElementById('containsbtn');
  const findBtn = document.getElementById('findbtn');
  const atBtn = document.getElementById('atbtn');
  const insertatBtn = document.getElementById('insertatbtn');
  const removeatBtn = document.getElementById('removeatbtn');
  const tostringBtn = document.getElementById('tostringbtn');

  appendBtn.addEventListener('click', () => {
    options.renderAppend(handleAppend);
  });

  function handleAppend(value) {
    const newNodeId = list.append(value);
    const newNode = canCon.createNode(value, newNodeId);

    let left, top;

    if (list.size() === 1) {
      [left, top] = canCon.getStartingPosition();
    } else {
      const lastNode = list.at(list.size() - 2);
      const lastRect = document
        .querySelector(`.node[data-nodeid="${lastNode.id}"]`)
        .getBoundingClientRect();
      left = lastRect.left + 200; // 200 px spacing between elements
      top = lastRect.top + (Math.random() * 100 - 50);
    }

    canCon.appendNodeToDom(newNode, left, top);
    canCon.connectNodes();
  }

  prependBtn.addEventListener('click', () => {
    options.renderPrepend(handlePrepend);
  });

  function handlePrepend(value) {
    const newNodeId = list.prepend(value);
    const newNode = canCon.createNode(value, newNodeId);

    let left, top;

    if (list.size() === 1) {
      [left, top] = canCon.getStartingPosition();
    } else {
      const lastNode = list.at(1); // The 'head' node is at 0, so the first real node is 1
      const lastRect = document
        .querySelector(`.node[data-nodeid="${lastNode.id}"]`)
        .getBoundingClientRect();
      left = lastRect.left - 140; // 200 px spacing between elements
      top = lastRect.top + (Math.random() * 100 - 50);
    }

    canCon.appendNodeToDom(newNode, left, top);
    canCon.connectNodes();
  }
}

const a = Controls();
