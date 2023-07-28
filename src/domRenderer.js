export default function DomRenderer() {
  const contentContainer = document.getElementById('content-container');
  const canvasContainer = document.getElementById('canvas-container');

  const canvasInfoBox = document.createElement('div');
  canvasInfoBox.classList.add('canvas-info-text');
  canvasInfoBox.style.display = 'none';
  canvasContainer.appendChild(canvasInfoBox);

  const canvasUpperBox = document.createElement('div');
  canvasUpperBox.classList.add('canvas-upper-text');
  canvasContainer.appendChild(canvasUpperBox);

  function setUpperBoxText(text) {
    canvasUpperBox.textContent = text;
  }

  function _clearRenders() {
    contentContainer.textContent = '';
    canvasInfoBox.style.display = 'none';
    const overlays = document.querySelectorAll('.node-overlay');
    overlays.forEach((overlay) => overlay.remove());
  }

  function renderNewList() {
    _clearRenders();
    contentContainer.innerHTML = `
        <h3>New list created!</h3>
      `;
  }

  function renderAppend(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
        <h3>append(<span>value</span>):</h3>
        <div>
          Add <span>value</span> to the end of the list
        </div>
        <label for="inputtext">
          list.append(<input
            type="text"
            id="inputtext"
            name="inputtext"
            placeholder="value"
          />)</label>
        <button type="button" id="appendExe">Execute!</button>
      `;

    const appendExe = document.getElementById('appendExe');

    appendExe.addEventListener('click', () => {
      const inputField = document.getElementById('inputtext');
      const value = inputField.value;
      handler(value);

      inputField.value = '';
    });
  }

  function renderPrepend(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
        <h3>prepend(<span>value</span>):</h3>
        <div>
          Add <span>value</span> to the beginning of the list
        </div>
        <label for="inputtext">
          list.prepend(<input
            type="text"
            id="inputtext"
            name="inputtext"
            placeholder="value"
          />)</label>
        <button type="button" id="appendExe">Execute!</button>
      `;

    const prependExe = document.getElementById('appendExe');

    prependExe.addEventListener('click', () => {
      const inputField = document.getElementById('inputtext');
      const value = inputField.value;
      handler(value);

      inputField.value = '';
    });
  }

  function renderHead(id) {
    _clearRenders();
    contentContainer.innerHTML = `
        <h3>head():</h3>
        <div>
          Return the first node in the list.
        </div>
      `;
  }

  function renderTail(id) {
    _clearRenders();
    contentContainer.innerHTML = `
        <h3>tail():</h3>
        <div>
          Return the last node in the list.
        </div>
      `;
  }

  function renderPop() {
    _clearRenders();
    contentContainer.innerHTML = `
        <h3>pop():</h3>
        <div>
          Remove the last node in the list.
        </div>
      `;
  }

  function displayInfoBox(message) {
    canvasInfoBox.textContent = message;
    canvasInfoBox.style.display = 'inline';
  }

  function hideInfoBox() {
    canvasInfoBox.textContent = '';
    canvasInfoBox.style.display = 'none';
  }

  function renderSize() {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>size():</h3>
      <div>
        Return the number of nodes in the list.
      </div>
    `;
  }

  function renderContains(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>contains(<span>value</span>):</h3>
      <div>
        Return true if <span>value</span> is in the list, otherwise return false.
      </div>
      <label for="inputtext">
        list.contains(<input
          type="text"
          id="inputtext"
          name="inputtext"
          placeholder="value"
        />)</label>
      <button type="button" id="appendExe">Execute!</button>
    `;

    appendExe.addEventListener('click', () => {
      const inputField = document.getElementById('inputtext');
      let value = inputField.value.trim();
      handler(value);
    });
  }

  function renderFind(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>find(<span>value</span>):</h3>
      <div>
        Return the index of the first node which contains <span>value</span>, or null if not found.
      </div>
      <label for="inputtext">
        list.find(<input
          type="text"
          id="inputtext"
          name="inputtext"
          placeholder="value"
        />)</label>
      <button type="button" id="appendExe">Execute!</button>
    `;

    appendExe.addEventListener('click', () => {
      canvasInfoBox.style.display = 'none';
      const overlays = document.querySelectorAll('.node-overlay');
      overlays.forEach((overlay) => overlay.remove());

      const inputField = document.getElementById('inputtext');
      const value = inputField.value;
      handler(value);
    });
  }

  function renderAt(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>at(<span>index</span>):</h3>
      <div>
        Return the node which is located at the given <span>index</span>.
      </div>
      <label for="inputtext">
        list.at(<input
          type="number"
          id="inputtext"
          name="inputtext"
          placeholder="index"
        />)</label>
      <button type="button" id="appendExe">Execute!</button>
    `;

    appendExe.addEventListener('click', () => {
      const inputField = document.getElementById('inputtext');
      const value = inputField.value;
      handler(Number(value));
    });
  }

  function renderInsertAt(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>insertAt(<span>value</span>, <span>index</span>):</h3>
      <div>
        Insert <span>value</span> at position <span>index</span>.
      </div>
      <label for="inputtext">
        list.insertAt(<input
          type="text"
          id="inputtext"
          name="inputtext"
          placeholder="value"
        />, <input
        type="number"
        id="inputindex"
        name="inputindex"
        placeholder="index"
      />)</label>

      <button type="button" id="appendExe">Execute!</button>
    `;

    appendExe.addEventListener('click', () => {
      const value = document.getElementById('inputtext').value;
      const index = document.getElementById('inputindex').value;
      handler(value, Number(index));
    });
  }

  function renderRemoveAt(handler) {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>removeAt(<span>index</span>):</h3>
      <div>
        Removes the node at position <span>index</span>.
      </div>
      <label for="inputtext">
        list.insertAt(<input
        type="number"
        id="inputindex"
        name="inputindex"
        placeholder="index"
      />)</label>

      <button type="button" id="appendExe">Execute!</button>
    `;

    appendExe.addEventListener('click', () => {
      const index = document.getElementById('inputindex').value;
      handler(Number(index));
    });
  }

  function renderToString() {
    _clearRenders();
    contentContainer.innerHTML = `
      <h3>toString():</h3>
      <div>
        Returns the values of the list as a string.
      </div>
    `;
  }

  return {
    displayInfoBox,
    hideInfoBox,
    setUpperBoxText,
    renderNewList,
    renderAppend,
    renderPrepend,
    renderHead,
    renderTail,
    renderPop,
    renderSize,
    renderContains,
    renderFind,
    renderAt,
    renderInsertAt,
    renderRemoveAt,
    renderToString,
  };
}
