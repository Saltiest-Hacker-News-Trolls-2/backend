const kx = require("../db_interface");

module.exports = {
  checkPW
};

function checkPW(username) {
  return kx
    .select("password")
    .from("users")
    .where("username", username)
    .first();
}
