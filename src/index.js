import './basestyle.css';
import './style.css';
import LinkedList from './linkedList';

// const canvas = document.createElement('canvas');
const canvas = document.getElementById('linkedlistcanvas');
const ctx = canvas.getContext('2d');
let canvasRect;

canvasInit(ctx);

function canvasInit(ctx) {
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

let nodeCounter = 0;
function createNode(value, x, y) {
  const node = document.createElement('div');
  node.className = 'node square';
  node.setAttribute('data-nodeid', nodeCounter);
  nodeCounter += 1;

  node.style.left = `${x}px`;
  node.style.top = `${y}px`;

  const nodeValue = document.createElement('div');
  nodeValue.className = 'nodevalue';
  nodeValue.textContent = value;
  const nodePointer = document.createElement('div');
  nodePointer.className = 'nodepointer';
  const randomNumber = Math.floor(Math.random() * 4228250624);
  nodePointer.textContent = `0x${randomNumber.toString(16)}`;

  node.append(nodeValue, nodePointer);

  return node;
}

const box1 = createNode('test1', 50, 200);
const box2 = createNode('test2', 400, 300);
document.body.append(box1, box2);

// const box1rect = box1.getBoundingClientRect();
// const box2rect = box2.getBoundingClientRect();

function connectNodes() {
  const box1rect = document
    .querySelector('.node.square[data-nodeid="0"] .nodepointer')
    .getBoundingClientRect();
  const box2rect = document
    .querySelector('.node.square[data-nodeid="1"] .nodevalue')
    .getBoundingClientRect();

  const box1YCenter = (box1rect.top + box1rect.bottom) / 2;
  const box2YCenter = (box2rect.top + box2rect.bottom) / 2;

  const startX = box1rect.right + window.scrollX;
  const startY = box1YCenter - canvasRect.top;
  const endX = box2rect.left + window.scrollX;
  const endY = box2YCenter - canvasRect.top;

  // Clear the canvas before drawing the connections
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(startX, startY);

  // Add 80 pixels to make the contol points push out to the right
  ctx.bezierCurveTo(startX + 80, startY, endX - 80, endY, endX, endY);
  ctx.stroke();
}

connectNodes();

window.addEventListener('resize', () => {
  canvasInit(ctx);
  const nodes = document.querySelectorAll('.node');
  nodes.forEach((node) => {
    const nodeRect = node.getBoundingClientRect();
    const [newX, newY] = clampCoordinates(
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

function clampCoordinates(x, y, width, height) {
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

window.addEventListener('mousedown', (e) => {
  if (!e.target.className.includes('node')) return;
  const nodeId = e.target.dataset.nodeid;

  const draggedElement = document.querySelector(
    `.node.square[data-nodeid="${nodeId}"]`
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

    const [newX, newY] = clampCoordinates(
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
