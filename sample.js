
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
let b ={}
let a = [b]
a[0].a = 1
a[0].b =2
a[0].c = 3
console.log(a[0])
