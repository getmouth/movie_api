const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true, lowercase: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
},{timestamps: true});

var User = mongoose.model('User', userSchema);
module.exports = User;