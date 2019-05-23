const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/users');
const passportJWT = require('passport-jwt');


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField:'Password'
},(username, password, callback) => {
  console.log(username+ " "+ password);
  Users.findOne({Username: username}, (err, user) => {
    if(err) {
      console.log(err);
      return callback(err);
    }
    if(!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password'});
    }
    console.log('finished');
    return callback(null,user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
},(jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
  .then(user => {
    return callback(null, user);
  })
  .catch(err => callback(err))
}));
