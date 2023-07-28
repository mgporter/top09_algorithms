// class Node {
//   id = 0;
//   constructor(value) {
//     this.value = value;
//     this.next = null;
//     this.id = id;
//     id++;
//   }
// }

function Node() {
  let id = 0;

  function create(value) {
    const node = {
      value: value,
      next: null,
      id: id, // Give each node a unique Id to make dom rendering easier
    };
    id++;
    return node;
  }

  return {
    create,
  };
}

export default function LinkedList() {
  // create the head of the list
  const node = Node();

  const headNode = node.create();

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
    const newNode = node.create(value);
    const lastNode = tail();
    lastNode.next = newNode;
    return newNode.id;
  }

  function prepend(value) {
    const newNode = node.create(value);
    const temp = headNode.next;
    headNode.next = newNode;
    newNode.next = temp;
    return newNode.id;
  }

  function pop() {
    let temp = headNode;
    let poppedNodeId = null;
    while (temp.next) {
      if (temp.next.next === null) {
        poppedNodeId = temp.next.id;

        temp.next = null;
        return poppedNodeId;
      }
      temp = temp.next;
    }

    return null;
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
      console.log(counter);
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

    const newNode = node.create(value);

    while (temp.next) {
      if (counter === index - 1) {
        newNode.next = temp.next;
        temp.next = newNode;
        return newNode.id;
      }
      temp = temp.next;
      counter += 1;
    }
    return;
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

  function traverse() {
    // return an object with all of the data points in order, so that
    // they can be conviently displayed on the DOM
    const data = [];
    let counter = 0;
    let temp = head;
    while (temp.next) {
      data[counter] = temp.next.value;
      temp = temp.next;
    }

    return data;
  }

  function removeAllNodes() {
    headNode.next = null;
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
    traverse,
    removeAllNodes,
  };
}
