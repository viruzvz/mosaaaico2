import leftPad from 'left-pad'

var r = leftPad('lc', 12, '-')

class F {
  f () {
    console.log(r)
  }
}


const f = new F()
f.f()

