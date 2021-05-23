let LEXOGRAPHIC_ASC_SORT = (a, b) => {
  return a.localCompare(b);
}

class TreeNode {
  constructor(value, data = null, isCompleting = false) {
    this.value = value;
    this.data = data;
    this.children = new Map();
    this.isCompleting = isCompleting;
  }

  getChild(value) {
    return this.children.get(value);
  }

  addChild(value, data = null) {
    let newNode = new TreeNode(value, data);
    this.children.set(value, newNode);
    return newNode;
  }
}

class Trie {
  constructor() {
    this.root = new TreeNode(null);
  }

  /**
   * 
   * @param String value the value to add
   * @param {*} data the data to add at the added node
   */
  add(value, data) {
    let node = this.root;
    
    let i = 0;
    while (node.getChild(value.charAt(i))) {
      node = node.getChild(value.charAt(i));
      i++;
    }

    while (i < value.length) {
      node = node.addChild(value.charAt(i++));
    }

    node.data = data;
    node.isCompleting = true;

    return node;
  }

  contains(value, data) {
    let i = 0;
    let node = this.root;
    while (node = node.getChild(value.charAt(i))) i++;

    if (i < value.length) return false;
    else return true;
  }

  // prefix match on all nodes that match with value. equivelent of ^value.*
  match(value, onMatch = (treeNode) => treeNode.data) {
    let resultNodes = [];
    let node = this.root;
    let i = 0;
    
    // iterate down to deepest node / latest character in value available
    while (node.getChild(value.charAt(i))) {
      node = node.getChild(value.charAt(i));
      i++;
    }

    // there weren't enough nodes to exhaust our string || there is no such node that matched value[i], we're gunna return an empty array
    if (i < value.length || !node) return resultNodes;

    // depth first tree traversal to collect all the completing nodes
    let queue = [];
    queue.push(node);

    while(queue.length > 0) {
      let currentNode = queue.shift();
      if (currentNode.isCompleting) resultNodes.push(onMatch(currentNode));
      let it = currentNode.children.entries();
      let child = it.next();
      while (!child.done) {
        queue.push(child.value[1]);
        child = it.next();
      }
    }

    return resultNodes;
  }
}

module.exports = Trie;
