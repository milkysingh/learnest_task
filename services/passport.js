const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook").Strategy;
const keys = require("../config");
const MongoServices = require("./mongoService");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await MongoServices.findUserById(id);

  if (user) {
    done(null, user);
  }
});

passport.use(new GoogleStrategy(
  {
    clientID: keys.googleClientId,
    clientSecret: keys.googleSecretKey,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await MongoServices.findUserByCredentials(profile.emails[0].value);
    if (existingUser) {
      return done(null, existingUser);
    }
    const user = await MongoServices.createNewUser({
      name: profile.displayName,
      email: profile.emails[0].value,
      dob: profile._json.birthday /* eslint no-underscore-dangle: 0 */,
    });
    return done(null, user);
  },
));

passport.use(new FacebookStrategy(
  {
    clientID: keys.facbookClientId,
    clientSecret: keys.facebookSecretKey,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["id", "email", "name", "birthday"],
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await MongoServices.findUserByCredentials(profile.emails[0].value);
    if (existingUser) {
      return done(null, existingUser);
    }
    const user = await MongoServices.createNewUser({
      name: `${profile._json.first_name} ${profile._json.last_name}`,
      email: profile._json.email,
      dob: profile._json.birthday,
    });
    return done(null, user);
  },
));
