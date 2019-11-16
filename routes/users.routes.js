const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { usersDML: kxu, allPurpose: kxa } = require("../db/dml");

const { logErrors, errHandler, validateBody } = require("../middleware");

const generateToken = require("../jwt/generateJWT");

router.post(
  "/register",
  validateBody("username", "password", "department"),
  (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    kxa
      .add(user, "users")
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
);

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  kxa
    .getOneBy({ username }, "users")
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // generate jwt if using JWT
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.use(logErrors, errHandler);
module.exports = router;
