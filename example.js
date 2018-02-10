
import {render, c} from './index';

const Main = () => {
  return c('div', {
    c: c('div', {
      c: [c(StatefullComponent), c(StatefullComponent)]
    })
  })
}


const StatefullComponent = {
  state: {
    counter: 0
  },
  render: function() {
    return c('div', {
      onclick: () => {
        this.setState({
          counter: this.state.counter + 1
        });
      },
      c: 'Yo, you should click me. Counter is: ' + this.state.counter
    })
  }
}

render(Main(), document.getElementById('app'))
