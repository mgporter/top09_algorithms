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
  const insertAtBtn = document.getElementById('insertatbtn');
  const removeAtBtn = document.getElementById('removeatbtn');
  const toStringBtn = document.getElementById('tostringbtn');

  options.setUpperBoxText(
    'Start by clicking "Append()". Feel free to drag the nodes around ;)'
  );

  function getNodeById(id) {
    return document.querySelector(`.node[data-nodeid="${id}"]`);
  }

  newListBtn.addEventListener('click', () => {
    options.renderNewList();
    list.removeAllNodes();
    canCon.removeAllNodes();
  });

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
      const lastRect = getNodeById(lastNode.id).getBoundingClientRect();
      left = lastRect.left + 200; // 200 px spacing between elements
      top = lastRect.top + (Math.random() * 100 - 50);
    }

    canCon.appendNodeToDom(newNode, left, top);
    canCon.updatePointers();
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
      // Since we just prepended a node, the previous lastNode is in position 1, not 0
      const lastNode = list.at(1);
      const lastRect = getNodeById(lastNode.id).getBoundingClientRect();
      left = lastRect.left - 140; // 200 px spacing between elements
      top = lastRect.top + (Math.random() * 100 - 50);
    }

    canCon.appendNodeToDom(newNode, left, top);
    canCon.updatePointers();
    canCon.connectNodes();
  }

  function _removeFlash(e) {
    e.currentTarget.classList.remove('flash');
    e.currentTarget.removeEventListener('animationend', _removeFlash);
  }

  function flashNode(node) {
    node.classList.add('flash');
    node.addEventListener('animationend', _removeFlash);
  }

  headBtn.addEventListener('click', () => {
    options.renderHead();
    if (list.size() === 0) return;
    const headId = list.at(0).id;
    flashNode(getNodeById(headId));
  });

  tailBtn.addEventListener('click', () => {
    options.renderTail();
    if (list.size() === 0) return;
    const tailId = list.at(list.size() - 1).id;
    flashNode(getNodeById(tailId));
  });

  popBtn.addEventListener('click', () => {
    options.renderPop();
    if (list.size() === 0) return;
    const removedNodeId = list.pop();
    canCon.removeNode(removedNodeId);
    canCon.updatePointers();
    canCon.connectNodes();
  });

  sizeBtn.addEventListener('click', () => {
    options.renderSize();
    options.displayInfoBox(`size: ${list.size()}`);
  });

  containsBtn.addEventListener('click', () => {
    options.renderContains(handleContains);
  });

  function trimDisplayValue(value) {
    if (value.length < 24) {
      return value;
    } else {
      return `${value.substring(0, 23)}...`;
    }
  }

  function handleContains(value) {
    options.displayInfoBox(
      `contains "${trimDisplayValue(value)}": ${list.contains(value)}`
    );
  }

  findBtn.addEventListener('click', () => {
    options.renderFind(handleFind);
  });

  function handleFind(value) {
    const index = list.find(value);
    if (index === null) {
      options.displayInfoBox(`null: "${trimDisplayValue(value)}" not found`);
      return;
    }

    const node = getNodeById(list.at(index).id);
    flashNode(node);
    const nodeOverlay = document.createElement('div');
    nodeOverlay.textContent = index;
    nodeOverlay.classList.add('node-overlay');
    node.appendChild(nodeOverlay);
  }

  atBtn.addEventListener('click', () => {
    options.renderAt(handleAt);
  });

  function handleAt(index) {
    options.hideInfoBox();

    let node;
    console.log(index);
    try {
      node = list.at(index);
    } catch (e) {
      options.displayInfoBox(`error: ${e.message}`);
      return;
    }

    flashNode(getNodeById(node.id));
  }

  insertAtBtn.addEventListener('click', () => {
    options.renderInsertAt(handleInsertAt);
  });

  function handleInsertAt(value, index) {
    options.hideInfoBox();

    if (index === 0) {
      handlePrepend(value);
      return;
    } else if (index === list.size()) {
      handleAppend(value);
      return;
    }

    let newNodeId;

    try {
      newNodeId = list.insertAt(value, index);
    } catch (e) {
      options.displayInfoBox(`error: ${e.message}`);
      return;
    }

    const newNode = canCon.createNode(value, newNodeId);

    let left, top;

    const prevNode = list.at(index - 1);
    const prevRect = getNodeById(prevNode.id).getBoundingClientRect();
    left = prevRect.left + 80;
    top = prevRect.top + (Math.random() * 100 - 120);

    canCon.appendNodeToDom(newNode, left, top);
    canCon.updatePointers();
    canCon.connectNodes();
  }

  removeAtBtn.addEventListener('click', () => {
    options.renderRemoveAt(handleRemoveAt);
  });

  function handleRemoveAt(index) {
    options.hideInfoBox();

    let removed;

    try {
      removed = list.removeAt(index);
    } catch (e) {
      options.displayInfoBox(`error: ${e.message}`);
      return;
    }

    canCon.removeNode(removed.id);
    canCon.updatePointers();
    canCon.connectNodes();
  }

  toStringBtn.addEventListener('click', () => {
    options.renderToString();
    options.displayInfoBox(`output: ${list.toString()}`);
  });
}

const a = Controls();
