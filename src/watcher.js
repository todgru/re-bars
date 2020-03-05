import Utils from "./utils.js";

export default {
  create({ appId, compId, props, data, methods, watchers, name }) {
    const cStore = Utils.getStorage(appId, compId);
    const appStore = Utils.getStorage(appId);

    function _handler(path) {
      Object.entries(watchers).forEach(([watch, fn]) => {
        if (Utils.shouldRender(path, watch)) fn();
      });

      Object.entries(cStore.renders).forEach(([eId, handler]) => {
        if (Utils.shouldRender(path, handler.path)) {
          const $target = Utils.findWatcher(eId);
          if ($target) {
            const html = handler.render();
            const $active = document.activeElement;
            const activeRef = {
              ref: $active.dataset.rbsRef,
              pos: $active.selectionStart,
            };

            if ($target.innerHTML !== html) {
              $target.style.display = html === "" ? "none" : "";

              $target.innerHTML = html;
              console.log(`component:${name} ${path}`, $target);
              const $input = Utils.findRefs($target)[activeRef.ref];

              if ($input) {
                if (Array.isArray($input)) {
                  console.warn(
                    `component:${name} ref ${activeRef.ref} is used more than once. The focus cannot be restored. If using bind, add a ref="uniqeName" to each`
                  );
                } else {
                  $input.focus();
                  if (activeRef.pos) $input.setSelectionRange(activeRef.pos + 1, activeRef.pos + 1);
                }
              }
            }
          } else {
            delete cStore.renders[eId];
          }
        }
      });

      Object.keys(appStore.inst).forEach(cId => {
        if (!Utils.findComponent(cId)) {
          // will fire destory hook here...
          delete appStore.inst[cId];
        }
      });
    }

    // the proxy building

    function _buildProxy(raw, tree = []) {
      return new Proxy(raw, {
        get: function(target, prop) {
          if (prop === "ReBarsPath") return tree.join(".");
          const value = Reflect.get(...arguments);
          // this lets us pass functions around...
          if (typeof value === "function" && target.hasOwnProperty(prop)) return value.bind(proxyData);
          if (value !== null && typeof value === "object" && prop !== "methods")
            return _buildProxy(value, tree.concat(prop));
          else return value;
        },

        set: function(target, prop) {
          const ret = Reflect.set(...arguments);
          _handler(tree.concat(prop).join("."));
          return ret;
        },

        deleteProperty: function(target, prop) {
          const ret = Reflect.deleteProperty(...arguments);
          _handler(tree.concat(prop).join("."));
          return ret;
        },
      });
    }

    const proxyData = _buildProxy({ ...props, ...data(), ...{ methods }, $_componentId: compId, $_appId: appId });
    return proxyData;
  },
};
