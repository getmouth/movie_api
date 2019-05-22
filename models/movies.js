const mongoose = require('mongoose');


var movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
  },
  ImagePath: String,
  Featured: Boolean
},{timestamps: true});


var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

