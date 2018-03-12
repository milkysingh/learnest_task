const UserServices = require("../services/userService");
const MongoServices = require("../services/mongoService");
const constants = require("../constants");

const ERROR_MESSAGES = constants.errorResponse;

module.exports = (app) => {
  // eslint-disable-next-line
  app.post("/signup", async (req, res) => {
    const {
      email, password, phoneNo, dob, name,
    } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Missing Credentials" });
    }
    if (email === "" || (password && password === "")) {
      return res.status(400).send({ error: "Missing Credentials" });
    }
    const encryptPassword = await UserServices.hashPasswordUsingBcrypt(password);

    const data = {
      email: email.trim(),
      password: encryptPassword,
      phoneNo,
      dob,
      name,
    };

    let user;
    try {
      user = await MongoServices.createNewUser(data);

      const criteriaForJWT = {
        // eslint-disable-next-line
        id: user._id,
        date: new Date(),
      };
      const token = await UserServices.generateAuthToken(criteriaForJWT);
      if (token) {
        res
          .header("x-auth", token)
          .status(200)
          .send(constants.sucessResponses.SUCCESS_SIGNUP);
      }
    } catch (error) {
      return res.status(409).send({ error });
    }
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserServices.findUser(email, password);

    if (user) {
      const criteriaForJWT = {
        // eslint-disable-next-line
        id: user._id,
        date: new Date(),
      };
      const token = await UserServices.generateAuthToken(criteriaForJWT);

      return res
        .header("x-auth", token)
        .status(200)
        .send(constants.sucessResponses.SUCCESS_SIGNIN);
    }
    return res.status(401).send(ERROR_MESSAGES.UNAUTHORISED);
  });
};
