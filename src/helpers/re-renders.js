import Utils from "../utils.js";

export default function(storage, { instance, name }) {
  const _getPath = (target, wildcard = true) => {
    if (target === undefined)
      throw new Error(`have passed undefined to watch helper in component '${name}'`);
    return typeof target === "object" ? `${target.ReBarsPath}${wildcard ? ".*" : ""}` : target;
  };

  const _watch = (path, render) => {
    const eId = Utils.randomId();
    storage.renders[eId] = { path, render };
    return eId;
  };

  instance.registerHelper("debug", function(obj) {
    const render = () => `<pre class="debug">${JSON.stringify(obj, null, 2)}</pre>`;
    const eId = _watch(_getPath(obj), render);
    return new instance.SafeString(Utils.wrapTemplate(eId, render()));
  });

  instance.registerHelper("watch", function(...args) {
    const { fn } = args.pop();
    const path = args
      .map(arg => _getPath(arg, false))
      .join(".")
      .split(",");

    const eId = _watch(path, () => fn(this));
    return Utils.wrapTemplate(eId, fn(this));
  });

  // instance.registerHelper("watchEach", function(arr, { fn }) {
  //   if (!Array.isArray(arr)) throw new Error("watchEach must be passed an Array");
  //   const path = arr.ReBarsPath;
  //
  //   return arr.map(function(item, index) {
  //     const eId = _watch(`${path}.${index}.*`, fn.bind(this));
  //     return Utils.wrapTemplate(eId, fn(this));
  //   });
  // });
}
