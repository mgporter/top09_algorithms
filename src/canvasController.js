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
    const randomNumber = Math.floor(Math.random() * 4228250624);
    nodePointer.textContent = `0x${randomNumber.toString(16)}`;

    node.append(nodeValue, nodePointer);

    return node;
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
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

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

  // function append(value) {
  //   const newNode = _createNode(value);
  //   nodeObjects.push(newNode);

  //   let left, top;
  //   if (nodeObjects.length === 1) {
  //     [left, top] = _getStartingPosition();
  //   } else {
  //     const lastNode = nodeObjects[nodeObjects.length - 2];
  //     const lastRect = lastNode.getBoundingClientRect();
  //     left = lastRect.left + 200; // 200 px spacing between elements
  //     top = lastRect.top + (Math.random() * 100 - 50);
  //   }

  //   _appendNodeToDom(newNode, left, top);
  //   _connectNodes();
  // }

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

      if (!mouseDown) cancelAnimationFrame(animation);
    }

    animate();
  });

  return {
    createNode,
    getStartingPosition,
    appendNodeToDom,
    connectNodes,
  };
}
