export function c(elm, props) {
  elm = document.createElement(elm);

  if (typeof props == "string") {
    elm.appendChild(document.createTextNode(props));
    return elm;
  }

  props = typeof props == "function" ? props() : props;

  Object.keys(props).forEach(key => {
    if (key != "c") elm[key] = props[key];
  });
  if (props.c) {
    if (Array.isArray(props.c)) {
      props.c.forEach(c => {
        elm.appendChild(c);
      });
    } else {
      elm.appendChild(props.c);
    }
  }
  return elm;
}

export function render(elm, node) {
  node.appendChild(elm);
}
