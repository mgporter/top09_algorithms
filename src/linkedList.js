class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export default function LinkedList() {
  // create the head of the list
  const headNode = new Node();

  // Whenever we are given an index, check if it is valid
  function _checkIndex(index) {
    if (typeof index !== 'number')
      throw new TypeError('Index must be a number');
    if (index < 0 || index > size() - 1)
      throw new RangeError('Index out of range');
  }

  function head() {
    return headNode.next;
  }

  function tail() {
    let temp = headNode;
    while (temp.next) {
      temp = temp.next;
    }
    return temp;
  }

  function append(value) {
    const newNode = new Node(value);
    const lastNode = tail();
    lastNode.next = newNode;
  }

  function prepend(value) {
    const newNode = new Node(value);
    const temp = headNode.next;
    headNode.next = newNode;
    newNode.next = temp;
  }

  function pop() {
    let temp = headNode;
    while (temp.next) {
      if (temp.next.next === null) {
        temp.next = null;
        return;
      }
      temp = temp.next;
    }
  }

  function size() {
    let counter = 0;
    let temp = headNode;
    while (temp.next) {
      temp = temp.next;
      counter += 1;
    }
    return counter;
  }

  function contains(value) {
    let temp = headNode;
    while (temp.next) {
      if (temp.next.value == value) return true;
      temp = temp.next;
    }
    return false;
  }

  function find(value) {
    let counter = 0;
    let temp = headNode;
    while (temp.next) {
      if (temp.next.value == value) return counter;
      temp = temp.next;
      counter += 1;
    }
    return null;
  }

  function at(index) {
    let counter = -1;
    let temp = headNode;
    _checkIndex(index);
    while (temp.next && counter < index) {
      temp = temp.next;
      counter += 1;
    }
    return temp;
  }

  function toString() {
    let temp = headNode;
    let string = '';
    while (temp.next) {
      string += `(${temp.next.value}) -> `;
      temp = temp.next;
    }
    string += 'null';
    return string;
  }

  function insertAt(value, index) {
    let counter = -1;
    let temp = headNode;
    _checkIndex(index);

    const newNode = new Node(value);

    while (temp.next) {
      if (counter === index - 1) {
        newNode.next = temp.next;
        temp.next = newNode;
        return;
      }
      temp = temp.next;
      counter += 1;
    }
  }

  function removeAt(index) {
    let counter = -1;
    let temp = headNode;
    _checkIndex(index);

    while (temp.next) {
      if (counter === index - 1) {
        const removed = temp.next;
        temp.next = temp.next.next;
        return removed;
      }
      temp = temp.next;
      counter += 1;
    }
  }

  return {
    append,
    prepend,
    head,
    tail,
    pop,
    size,
    contains,
    find,
    at,
    toString,
    insertAt,
    removeAt,
  };
}
