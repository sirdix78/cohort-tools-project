const { isAuthenticated } = require("../middleware/jwt.middleware");
const UserModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

//post route to signup a user and create them in the DB
router.post("/auth/signup", (req, res) => {
    //destructure name, email and password from the body
    const { email, password, name } = req.body;
    //generate the salt for the password first
    const mySalt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(password, mySalt);
    // console.log({ mySalt, hashedPassword, password });
    const hashedUser = {
      email,
      password: hashedPassword,
      name,
    };
  
    UserModel.create(hashedUser)
      .then((createdUser) => {
        console.log(createdUser);
        const userInDB = createdUser;
        userInDB.password = "*****";
        res.status(201).json(userInDB);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ errorMessage: "Problem creating a user" });
      });
  });


  //POST route to login a user that already exists in the DB
router.post("/auth/login", async (req, res) => {
    // try {
    //   //first we need to find the email in the DB
    //   const foundUser = await UserModel.findOne({ email: req.body.email });
    //   if (foundUser) {
    //     console.log("the user was found, ", foundUser);
    //     //the user email was found... but does their password match???
    //     if (req.body.password === foundUser.password) {
    //       res.status(200).json({ message: "You are logged in now!", foundUser });
    //     } else {
    //       res
    //         .status(400)
    //         .json({ errorMessage: "Email exists but password doesn't match" });
    //     }
    //   } else {
    //     res.status(400).json({ message: "Email doesn't exist" });
    //   }
    // } catch (error) {
    //   console.log(err);
    //   res.status(500).json({ errorMessage: "Problem logging in user" });
    // }
    UserModel.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        console.log("the user was found, ", foundUser);
        //the user email was found... but does their password match???
        const doesPasswordMatch = bcryptjs.compareSync(
          req.body.password,
          foundUser.password
        );
        //if the password matches and the email exist then we give the user a token
        if (doesPasswordMatch) {
          const theData = { _id: foundUser._id, name: foundUser.name };
          const authToken = jwt.sign(theData, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "24h",
          });
          res
            .status(200)
            .json({ message: "You are logged in now!", authToken });
        } else {
          res.status(400).json({ errorMessage: "incorrect password" });
        }
      } else {
        res.status(400).json({ message: "Email doesn't exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "Problem logging in user" });
    });
});

    //verify route to check the token
  router.get("/auth/verify", isAuthenticated, (req, res) => {
    console.log("hello from the route", req.payload);
    res
      .status(200)
      .json({ message: "You are still logged in", payload: req.payload });
  });

  router.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    UserModel.findById(id)
      .then((oneUser) => {
        console.log("here is one User", oneUser);
        res.status(200).json(oneUser);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ errorMessage: "trouble finding the one user" });
        // next(error);
      });
  });

  module.exports = router;