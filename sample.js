
/*function pSetTimeout() {
    return new Promise(resolve => {setTimeout(() => resolve(console.log("a")), 3000)})
}
async function test() {
    const add = [1, 2]
    add.forEach(async n => {
console.log(n)
    await pSetTimeout()
    console.log(n)
    })
}
test()*/
function person (name, age) {
    this.name = name;
    this.age = age;
}
person.prototype.greet = function () {
  console.log(`Hi, this is ${this.name}`)
}
let person1 = new person('jim', 46)
person1.greet()
function teacher (name, age, subject) {
  person.call(this, name, age)
  this.subject = subject
}
let person2 = Object.create(person1)
let teacher1 = new teacher('john', 48, 'math')
console.log(person2.__proto__)
console.log(person2.constructor.name)

console.log(teacher1.__proto__)
console.log(teacher1.prototype)
function doSomething(){}
doSomething.prototype.foo = "bar";
var doSomeInstancing = new doSomething();
doSomeInstancing.prop = "some value";
console.log("doSomeInstancing.prop:      " + doSomeInstancing.prop);
console.log("doSomeInstancing.foo:       " + doSomeInstancing.foo);
console.log("doSomething.prop:           " + doSomething.prop);
console.log("doSomething.foo:            " + doSomething.foo);
console.log("doSomething.prototype.prop: " + doSomething.prototype.prop);
console.log("doSomething.prototype.foo:  " + doSomething.prototype.foo);
let a = {}
console.log(a.b)
