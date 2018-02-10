
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
    console.log(elm)
    let node = document.createElement('div');
    elm.node = node; // Save the node to the object
    elm.setState = function(newState){
      this.state = newState;
      // This is not sufficient, as it will not preserve children state on re-render
      render(this.render(props), this.node)
    }

    props.c = elm.render(props);

    if(elm.hasInit === undefined){
      let temp = elm
      // This will cause a bug and mount the component again because
      // of the way we re-render. To fix.
      setTimeout(() =>{
        temp.init();
        temp.hasInit = true;
      }, 0)
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