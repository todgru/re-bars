import Logger from "./logger.js";
const msg = Logger("utils");

export default {
  watchId(options) {
    return `reactive-key-${options.loc.start.column}${options.loc.start.line}${options.loc.end.column}${options.loc.end.line}`;
  },

  isKeyedNode($node) {
    if ($node.children.length)
      return Array.from($node.children).every($child => $child.dataset.key);
    return false;
  },

  keyedChildren($node) {
    return Array.from($node.children).filter($e => $e.dataset.key);
  },

  swapNodes($source, $target) {
    const $clone = $source.cloneNode(true);
    $target.parentNode.replaceChild($clone, $target);
    return $clone;
  },

  addChild($container, $child) {
    const $clone = $child.cloneNode(true);
    $container.appendChild($clone);
    return $clone;
  },

  setKey(obj, path, value) {
    const arr = path.split(".");
    arr.reduce((pointer, key, index) => {
      if (!(key in pointer)) msg.warn(`${path} was not found in object`, obj);
      if (index + 1 === arr.length) pointer[key] = value;
      return pointer[key];
    }, obj);
  },
};
