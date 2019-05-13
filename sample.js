
function pSetTimeout() {
    return new Promise(resolve => {setTimeout(() => resolve(console.log("2")), 3000)})
}
async function test() {
    console.log("hi")
    await pSetTimeout()
    console.log("hello")
}
test()
