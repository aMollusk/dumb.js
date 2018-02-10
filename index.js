
function render(elm, node) {
  if(node.childNodes[0]) {
    node.replaceChild(elm, node.childNodes[0]);
    return
  }
  node.appendChild(elm);
}

function c(elm, props = {}) {
  if(typeof elm === 'object'){
    elm = Object.create(elm);
    elm.state = Object.assign({}, elm.state);
    let thing = document.createElement('div');
    elm.self = thing; // Save the node to the object
    elm.setState = function(newState){
      this.state = newState;
      render(this.render(props), this.self)
    }
    props.c = elm.render(props);
    elm = thing;
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
    } else if (typeof props.c === 'string'){
      elm.appendChild(document.createTextNode(props.c));
    } else {
      elm.appendChild(props.c);
    }
  }
  return elm;
}


export {
  render,
  c
}