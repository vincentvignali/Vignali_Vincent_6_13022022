const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("email-validator");
dotenv.config();

exports.signup = (req, res, next) => {
  /** --- */
  /** Validate the email coming from the user */
  if (!validator.validate(req.body.email)) {
    console.log("wrong email format");
    return res.status(401).json({ message: "Wrong email format" });
  }
  /** --- */

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          console.log("user created");
          return res.status(201).json({ message: "User successfully created" });
        })
        .catch((error) => res.status(401).json(error));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "identifiant/mdp incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res
              .status(401)
              .json({ message: "Paire identifiant/mot de passe incorrecte" });
          } else {
            return res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                {
                  userId: user._id,
                },
                process.env.SECRET_TOKEN_KEY,
                { expiresIn: "24h" }
              ),
            });
          }
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};
