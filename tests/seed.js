const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const User = mongoose.model("users");
const userService = require("../services/userService");
const config = require("../config");

const userOne = new ObjectID();
const userTwo = new ObjectID();
const users = [
  {
    _id: userOne,
    email: "singhmalkeet@gmail.com",
    dob: "01/01/1915",
    name: "Sunder Jeevan",
    password: userService.hashPasswordUsingBcrypt("malkeet"),
    phoneNo: "7009464752",

    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOne }, config.jwtSecret),
      },
    ],
  },
  {
    _id: userTwo,
    name: "John Doe",
    email: "aman@gmail.com",
    dob: "01/01/2015",
    password: userService.hashPasswordUsingBcrypt("malkeet"),
    phoneNo: "0987654321",
  },
];

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();
      return Promise.all([user1, user2]);
    })
    .then(() => done())
    .catch((e) => {
      throw e;
    });
};
module.exports = {
  populateUsers,
  users,
};
