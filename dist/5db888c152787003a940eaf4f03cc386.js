// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function render(elm, node) {
  if (node.childNodes[0]) {
    node.replaceChild(elm, node.childNodes[0]);
    return;
  }
  node.appendChild(elm);
}

function c(elm, props = {}) {
  if (typeof elm === 'object') {
    elm = Object.create(elm);
    elm.state = Object.assign({}, elm.state);
    console.log(elm);
    let node = document.createElement('div');
    elm.node = node; // Save the node to the object
    elm.setState = function (newState) {
      this.state = newState;
      // This is not sufficient, as it will not preserve children state on re-render
      render(this.render(props), this.node);
    };

    props.c = elm.render(props);

    if (elm.hasInit === undefined) {
      let temp = elm;
      // This will cause a bug and mount the component again because
      // of the way we re-render. To fix.
      setTimeout(() => {
        temp.init();
        temp.hasInit = true;
      }, 0);
    }

    elm = node;
  } else {
    elm = document.createElement(elm);
    if (typeof props == "string") {
      elm.appendChild(document.createTextNode(props));
      return elm;
    }
  }

  props = typeof props == "function" ? props() : props;

  Object.keys(props).forEach(key => {
    if (key != "c") elm[key] = props[key];
  });

  // Children
  if (props.c) {
    if (Array.isArray(props.c)) {
      props.c.forEach(c => {
        elm.appendChild(c);
      });
    } else if (typeof props.c === 'string') {
      elm.appendChild(document.createTextNode(props.c));
    } else {
      elm.appendChild(props.c);
    }
  }
  return elm;
}

exports.render = render;
exports.c = c;
},{}],2:[function(require,module,exports) {
"use strict";

var _index = require("./index");

const Main = () => {
  return (0, _index.c)('div', {
    c: (0, _index.c)('div', {
      c: [(0, _index.c)(StatefulComponent, { title: 'Hello there!' })]
    })
  });
};

const StatefulComponent = {
  state: {
    counter: 0
  },
  init: function () {},
  reRender: function () {
    console.log('re render!');
  },
  onClick: function () {
    console.log(this);
    this.setState({
      counter: this.state.counter + 1
    });
  },
  render: function (props) {
    return (0, _index.c)('div', {
      c: (0, _index.c)('div', {
        c: [(0, _index.c)('div', {
          onclick: () => {
            this.onClick();
          },
          c: (0, _index.c)('div', 'the counter is at ' + this.state.counter)
        })]
      })
    });
  }
};

(0, _index.render)(Main(), document.getElementById('app'));
},{"./index":3}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://localhost:56756/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])