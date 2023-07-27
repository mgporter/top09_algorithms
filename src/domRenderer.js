export default function DomRenderer() {
  const contentContainer = document.getElementById('content-container');

  function renderAppend(handler) {
    contentContainer.textContent = '';
    contentContainer.innerHTML = `
        <h3>Append(<span>value</span>):</h3>
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
    contentContainer.textContent = '';
    contentContainer.innerHTML = `
        <h3>Prepend(<span>value</span>):</h3>
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

  return {
    renderAppend,
    renderPrepend,
  };
}
