const cookieSession = require("cookie-session");
const { cookieKeys } = require("../config");
const passport = require("passport");

module.exports = (app) => {
  app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [cookieKeys],
  }));
  app.use(passport.initialize());

  app.use(passport.session());

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email", "https://www.googleapis.com/auth/user.birthday.read"],
    }),
  );

  app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
    res.send(req.user);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/getUser", (req, res) => {
    res.send(req.user);
  });

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email"],
    }),
  );
  app.get("/auth/facebook/callback", passport.authenticate("facebook"), (req, res) => {
    res.send(req.user);
  });
};
