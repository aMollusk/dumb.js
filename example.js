
import {render, c} from './index';


const Main = () => {
  return (
    c('div', {
      c: c('div', {
        c: [
          c(StatefulComponent, {title: 'Hello there!'})
        ]
      })
    })
  )
}

const StatefulComponent = {
  state: {
    counter: 0
  },
  init: function(){
    this.onClick = this.onClick.bind(this);
    this.setState({
      counter: 4
    })
  },
  reRender: function(){
    console.log('re render!')
  },
  onClick: function() {
    this.setState({
      counter: this.state.counter + 1
    });
  },
  render: function(props) {
    return c('div', {
      c: c('div', {
        c: [
          c('div', {
            onclick: this.onClick,
            c: c('div', 'the counter is at ' + this.state.counter)
          })
        ]
      })
    })
  }
}

render(Main(), document.getElementById('app'))
