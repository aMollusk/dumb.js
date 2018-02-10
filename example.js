
import {render, c} from './index';

const Main = () => {
  return (
    c('div', {
      c: c('div', {
        c: [
          c(StatefulComponent, {title: 'My stateful counter is: '}), 
          c(StatefulComponent, {title: 'Hey Im another component with my own state: '}),
        ]
      })
    })
  )
}

const StatefulComponent = {
  state: {
    counter: 0
  },
  render: function(props) {
    return c('div', {
      onclick: () => {
        this.setState({
          counter: this.state.counter + 1
        });
      },
      c: props.title + this.state.counter
    })
  }
}

render(Main(), document.getElementById('app'))
