// (function (d, s, id) {
//   var js
//   var fjs = d.getElementsByTagName(s)[0]
//   if (d.getElementById(id)) { return }
//   js = d.createElement(s)
//   js.id = id
//   js.src = 'https://connect.facebook.net/en_US/sdk.js'
//   fjs.parentNode.insertBefore(js, fjs)
// }(document, 'script', 'facebook-jssdk'))

// window.fbAsyncInit = function () {
//   // eslint-disable-next-line
//   FB.init({
//     appId: '396124057784726',
//     cookie: true,
//     xfbml: true,
//     version: 'v3.2'
//   })
//   // eslint-disable-next-line
//   FB.AppEvents.logPageView()
//   /* FB.getLoginStatus(function(response) {
//     console.log(response)
//   }) */
// }

// export function FbLogin () {
//   return new Promise((resolve, reject) => {
//     // eslint-disable-next-line
//     FB.login(function (response) {
//       console.log(response)
//       if (response.status === 'connected') {
//       // eslint-disable-next-line
//         FB.api('me?fields=id,name,email', response2 => {
//           console.log(response2)
//           resolve(response2)
//         })
//       } else reject(Error('User did not log in!'))
//     })
//   }, { scope: 'default, email' })
// }
