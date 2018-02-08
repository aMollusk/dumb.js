var x = function(elm, props) {
  var elm = document.createElement(elm);
  if (typeof props === "string") {
    elm.appendChild(document.createTextNode(props));
    return elm;
  }
  var props = typeof props === "function" ? props() : props;
  Object.keys(props).forEach(key => {
    if (key !== "x") elm[key] = props[key];
  });
  if (props.x) {
    if (Array.isArray(props.x)) {
      props.x.forEach(x => {
        elm.appendChild(x);
      });
    } else {
      elm.appendChild(props.x);
    }
  }
  return elm;
};

var r = function(elm, node) {
  node.appendChild(elm);
};

var App = x("div", () => {
  return {
    x: x("div", {
      x: x("div", {
        x: [x("span", "Hello"), x("span", "Hello"), x("span", "Hello")]
      })
    })
  };
});

r(App, document.getElementById("app"));
