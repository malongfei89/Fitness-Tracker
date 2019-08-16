
// function pSetTimeout() {
//     return new Promise(resolve => {setTimeout(() => resolve(console.log("a")), 3000)})
// }
// async function test() {
//     const add = [1, 2]
//     add.forEach(async n => {
//     console.log(n)
//     await pSetTimeout()
//     console.log(n)
//     })
// }
// test()



// function person (name, age) {
//     this.name = name;
//     this.age = age;
// }
// person.prototype.greet = function () {
//   console.log(`Hi, this is ${this.name}`)
// }
// let person1 = new person('jim', 46)
// person1.greet()
// function teacher (name, age, subject) {
//   person.call(this, name, age)
//   this.subject = subject
// }
// let person2 = Object.create(person1)
// let teacher1 = new teacher('john', 48, 'math')
// console.log(person2.__proto__)
// console.log(person2.constructor.name)

// console.log(teacher1.__proto__)
// console.log(teacher1.prototype)
// function doSomething(){}
// doSomething.prototype.foo = "bar";
// var doSomeInstancing = new doSomething();
// doSomeInstancing.prop = "some value";
// console.log("doSomeInstancing.prop:      " + doSomeInstancing.prop);
// console.log("doSomeInstancing.foo:       " + doSomeInstancing.foo);
// console.log("doSomething.prop:           " + doSomething.prop);
// console.log("doSomething.foo:            " + doSomething.foo);
// console.log("doSomething.prototype.prop: " + doSomething.prototype.prop);
// console.log("doSomething.prototype.foo:  " + doSomething.prototype.foo);
// let a = {}
// console.log(a.b)



// const {exec} = require("child_process")
let sendEmail = require('./server/models/sendEmail')
async function main() {
  let response = await sendEmail.sendEmail('longfeim89@gmail.com', 'mg071121mg@gmail.com', 'help', 'Hello', '<button>hello</button>')
  // let window = new Window()
  // exec(`start chrome ${response}`)
}
main().catch((err) => {
  console.log(err)
})


const conn = require('./mysql-connection')
conn.query(`call checkForUpdate(2, @total)`)
.then((data)=>{
    console.log("1." + data[0][0].needUpdate)
    conn.query('select @total')
    .then(data => {
        console.log("2." + data[0]["@total"])
    })
})
.catch((error)=>{
    console.log(error)
})

// process.stdout.write("\x07")
// let delay = function (seconds) {
//   return new Promise((resolve, reject)=>{
//     setTimeout(()=>resolve(), seconds*1000)
//   })
// }
// let start = process.hrtime()
// Promise.all([
//   delay(1),
//   delay(6),
//   delay(5)
// ])
// .then(()=>{
//   console.log(`took ${process.hrtime(start)[0]} seconds`)
// })
