const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const keys = require("../../config/keys");
const verify = require("../../utilities/verify-token");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const User = require("../../models/User");

router.get("/", (req, res) => {
  try {
    let jwtUser = jwt.verify(verify(req), keys.secretOrKey);
    let id = mongoose.Types.ObjectId(jwtUser.id);

    User.aggregate()
      .match({ _id: { $not: { $eq: id } } })
      .project({
        password: 0,
        __v: 0,
        date: 0,
      })
      .exec((err, users) => {
        if (err) {
          console.log(err);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Failure" }));
          res.sendStatus(500);
        } else {
          res.send(users);
        }
      });
  } catch (err) {
    console.log(err);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Unauthorized" }));
    res.sendStatus(401);
  }
});

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const payload = {
                id: user.id,
                name: user.name,
              };
              // Sign token
              jwt.sign(
                payload,
                keys.secretOrKey,
                {
                  expiresIn: 31556926, // 1 year in seconds
                },
                (err, token) => {
                  if (err) {
                    console.log(err);
                  } else {
                    req.io.sockets.emit("users", user.username);
                    res.json({
                      success: true,
                      token: "Bearer " + token,
                      name: user.name,
                      userId: user._id,
                    });
                  }
                }
              );
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.get("/get-user/:uId", (req, res) => {  // Changed from .post to .get and added parameter in the URL
  const _userId = req.params.uId;
  User.findOne({ _id: _userId })
      .then((result) => {
          if (result) {
              res.send({
                  message: 'success', 
                  user: {
                      email: result.email,
                      mobile: result.mobile,
                      username: result.username
                  }
              });
          } else {
              res.status(404).send({ message: 'User not found' });  // Handling user not found
          }
      })
      .catch((error) => {
          res.status(500).send({ message: 'Server error', error: error.toString() });  // More informative error
      });
});


router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  


  // Find user by username
  User.findOne({ username }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ usernamenotfound: "Username not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              name: user.name,
              username: user.username,
              userId: user._id,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/profile", verify, (req, res) => {
  try {
    const jwtUser = jwt.verify(verify(req), keys.secretOrKey);
    const id = mongoose.Types.ObjectId(jwtUser.id);

    User.findById(id)
      .select('-password -__v -date') // Exclude private fields
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Success", user });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/user/:userId", verify, (req, res) => {
  try {
    const _userId = req.params.userId;
    const requestingUser = jwt.verify(verify(req), keys.secretOrKey);

    if (!mongoose.Types.ObjectId.isValid(_userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    User.findById(_userId)
      .select('-password -__v -date') // Exclude private fields
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Success", user });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
});




module.exports = router;
