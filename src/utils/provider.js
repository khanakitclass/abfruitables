const passport = require('passport');
const Users = require('../model/users.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleLoginProvider = async () => {
  try {
    passport.use(new GoogleStrategy({
      clientID: process.env.PROVIDER_CLIENTID,
      clientSecret:process.env.PROVIDER_CLIENTSECRET,
      callbackURL: process.env.PROVIDER_CALLBACKURL  
    },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          let user = await Users.findOne({ googleId: profile.id });

          if (!user) {
            user = await Users.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              role: "user"
            });
          }
          console.log(user);
          return cb(null, user);
        } catch (error) {
          return cb(error, null);
        }
      }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function (data, done) {
      console.log("deserializeUser",data);
      try {
        const user = await Users.findById(_id);
        if (!user) {
          done(new Error('User not found'), null);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = googleLoginProvider;
