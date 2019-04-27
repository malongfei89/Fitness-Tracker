export function calculateTime (date) {
  var diff = Date.now() - date.getTime()
  const day = 1000 * 60 * 60 * 24
  var numOfYears = Math.floor(diff / day / 365)
  var numOfMonths = Math.floor(diff / day / 30)
  var numOfDays = Math.floor(diff / day)
  var numOfHours = Math.floor(diff / day * 24)
  var numOfminutes = Math.floor(diff / day * 24 * 60)
  if (numOfYears > 0) {
    if (numOfYears === 1) {
      return (numOfYears + ' year ago.')
    } else return (numOfYears + ' years ago.')
  } else if (numOfMonths > 0) {
    if (numOfMonths === 1) {
      return (numOfMonths + ' month ago.')
    } else return (numOfMonths + ' months ago.')
  } else if (numOfDays > 0) {
    if (numOfDays === 1) {
      return ' yesterday.'
    } else return (numOfDays + ' days ago.')
  } else if (numOfHours > 0) {
    if (numOfHours === 1) {
      return ' 1 hour ago.'
    } else return (numOfHours + ' hours ago.')
  } else if (numOfminutes >= 0) {
    if (numOfminutes === 0) {
      return ' just now.'
    } else if (numOfminutes === 1) {
      return ' a minute ago.'
    } else return (numOfminutes + ' minutes ago.')
  }
}
