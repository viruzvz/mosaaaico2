import $ from 'jquery'

class F {
  constructor () {
    console.log('this is me')
    console.log('this is me')
  }
}

const g = new F()

console.log(g, $.fn.jquery)
