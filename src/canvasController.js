export default function CanvasController(nodeList) {
  const canvas = document.getElementById('linkedlistcanvas');
  const ctx = canvas.getContext('2d');
  let canvasRect;
  const list = nodeList;

  _canvasInit(ctx);

  function _canvasInit(ctx) {
    // scale the canvas up and then down to make sure it looks clear

    // first we clear the old style settings
    canvas.style.width = '';
    canvas.style.height = '';

    // then get the canvas's size
    canvasRect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;

    // scale up the width and height canvas attributes, and then the scale up the context
    canvas.width = canvasRect.width * dpr;
    canvas.height = canvasRect.height * dpr;
    ctx.scale(dpr, dpr);

    // scale down the canvas by settings its CSS width/height to the original size
    canvas.style.width = `${canvasRect.width}px`;
    canvas.style.height = `${canvasRect.height}px`;
  }

  function createNode(value, id) {
    const node = document.createElement('div');
    node.className = 'node';
    node.setAttribute('data-nodeid', id);

    const nodeValue = document.createElement('div');
    nodeValue.className = 'nodevalue';
    nodeValue.textContent = value;
    const nodePointer = document.createElement('div');
    nodePointer.className = 'nodepointer';

    // Give the DOM node a fake memory address
    nodePointer.textContent = getRandomAddress();

    node.append(nodeValue, nodePointer);

    return node;
  }

  function removeNode(id) {
    const node = document.querySelector(`.node[data-nodeid="${id}"]`);
    node.remove();
  }

  function removeAllNodes() {
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node) => {
      node.remove();
    });
    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
  }

  function getStartingPosition() {
    const rect = canvas.getBoundingClientRect();
    const left = rect.width / 4 + window.scrollX;
    const top = rect.height / 3 + window.scrollY;
    return [left, top];
  }

  function appendNodeToDom(node, x, y) {
    document.body.appendChild(node);
    const rect = node.getBoundingClientRect();
    const [newX, newY] = _clampCoordinates(x, y, rect.width, rect.height);
    node.style.left = `${newX}px`;
    node.style.top = `${newY}px`;
  }

  function updatePointers() {
    // Make sure that the last node.next displays 'null'
    if (list.size() >= 1) {
      const lastNode = list.tail();
      const lastNodePointer = document.querySelector(
        `.node[data-nodeid="${lastNode.id}"] .nodepointer`
      );
      lastNodePointer.textContent = 'null';
    }

    // And that the second-last node's .next displays an address
    if (list.size() >= 2) {
      const secondLastNode = list.at(list.size() - 2);
      const secondLastNodePointer = document.querySelector(
        `.node[data-nodeid="${secondLastNode.id}"] .nodepointer`
      );
      if (secondLastNodePointer.textContent === 'null') {
        secondLastNodePointer.textContent = getRandomAddress();
      }
    }
  }

  function _drawConnectingLine(firstNodeId, secondNodeId) {
    const box1rect = document
      .querySelector(`.node[data-nodeid="${firstNodeId}"] .nodepointer`)
      .getBoundingClientRect();
    const box2rect = document
      .querySelector(`.node[data-nodeid="${secondNodeId}"] .nodevalue`)
      .getBoundingClientRect();

    const box1YCenter = (box1rect.top + box1rect.bottom) / 2;
    const box2YCenter = (box2rect.top + box2rect.bottom) / 2;

    const startX = box1rect.right + window.scrollX;
    const startY = box1YCenter - canvasRect.top;
    const endX = box2rect.left + window.scrollX;
    const endY = box2YCenter - canvasRect.top;

    ctx.moveTo(startX, startY);

    // Add 80 pixels to make the contol points push out to the right
    ctx.bezierCurveTo(startX + 80, startY, endX - 80, endY, endX, endY);
  }

  function connectNodes() {
    // Clear the canvas before drawing the connections
    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);

    // Set line styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Begin the path
    ctx.beginPath();

    // Loop through the nodes and create a Bezier curve to connect each pair
    const nodeCount = list.size();
    for (let i = 0; i < nodeCount - 1; i++) {
      const firstNodeId = list.at(i).id;
      const secondNodeId = list.at(i).next.id;
      _drawConnectingLine(firstNodeId, secondNodeId);
    }

    // Render the final line to the canvas
    ctx.stroke();
  }

  function _clampCoordinates(x, y, width, height) {
    // Clamp the new left value between canvasRect.left and (canvasRect.right - deRect.width), accounting for scroll
    const newX = Math.max(
      canvasRect.left + window.scrollX,
      Math.min(x, canvasRect.right - width + window.scrollX)
    );

    // Also clamp the top value
    const newY = Math.max(
      canvasRect.top + window.scrollY,
      Math.min(y, canvasRect.bottom - height + window.scrollY)
    );

    return [newX, newY];
  }

  // Add event listeners
  window.addEventListener('resize', () => {
    _canvasInit(ctx);
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect();
      const [newX, newY] = _clampCoordinates(
        nodeRect.left,
        nodeRect.top,
        nodeRect.width,
        nodeRect.height
      );
      node.style.left = `${newX}px`;
      node.style.top = `${newY}px`;
    });
    connectNodes();
  });

  window.addEventListener('scroll', () => {
    canvasRect = canvas.getBoundingClientRect();
  });

  window.addEventListener('mousedown', (e) => {
    if (!e.target.className.includes('node')) return;
    const nodeId = e.target.dataset.nodeid;

    const draggedElement = document.querySelector(
      `.node[data-nodeid="${nodeId}"]`
    );
    draggedElement.classList.add('selected');
    const deRect = draggedElement.getBoundingClientRect();

    let mouseDown = true;

    let deltaX = 0;
    let deltaY = 0;

    window.addEventListener('mouseup', (e) => {
      mouseDown = false;
    });

    window.addEventListener('mousemove', (moveEvent) => {
      deltaX = moveEvent.clientX - e.clientX;
      deltaY = moveEvent.clientY - e.clientY;
    });

    function animate() {
      const animation = requestAnimationFrame(animate);

      const [newX, newY] = _clampCoordinates(
        deRect.left + window.scrollX + deltaX,
        deRect.top + window.scrollY + deltaY,
        deRect.width,
        deRect.height
      );

      draggedElement.style.left = `${newX}px`;
      draggedElement.style.top = `${newY}px`;

      connectNodes();

      if (!mouseDown) {
        draggedElement.classList.remove('selected');
        cancelAnimationFrame(animation);
      }
    }

    animate();
  });

  function getRandomAddress() {
    const randomNumber = Math.floor(Math.random() * 4228250624);
    return `0x${randomNumber.toString(16)}`;
  }

  return {
    createNode,
    removeNode,
    removeAllNodes,
    getStartingPosition,
    appendNodeToDom,
    connectNodes,
    updatePointers,
  };
}
