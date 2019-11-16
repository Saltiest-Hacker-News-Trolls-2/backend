const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const secret = process.env.JWT_SECRET || "foobar";
  let token = req.headers.authorization;
  console.log(req.headers);
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(400).json({ message: "Not Authorized" });
      } else {
        console.log("decoded", decoded);
        req.headers.subject = decoded.subject;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
};
