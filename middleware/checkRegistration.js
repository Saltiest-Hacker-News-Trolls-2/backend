const { allPurpose: kxa, usersDML: kxu } = require('../db/dml')

async function checkRegistration(req, res, next) {
  const user = req.body
  //convert usernameto lowercase
  user.username = user.username.toLowerCase()
  // check that username and password are not taken

  req.body.username = user.username

  const matches = await kxu.checkRegistration(user.username, user.email)
  const errors = {}
  matches.forEach(match => {
    if (match.username === user.username) {
      errors.username = 'Sorry, that username is unavailable.'
    } else if (match.email === user.email) {
      errors.email =
        'An account has already been registered with that email address.'
    }
  })

  if (errors.email || errors.username) {
    return res.status(400).json({ errors })
  }
  return next()
}
module.exports = checkRegistration
