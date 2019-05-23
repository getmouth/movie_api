const express = require('express');
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Movies = require('./models/movies.js');
const Users = require('./models/users.js');
const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myflix',{useNewUrlParser: true}).then(
  ()=> console.log('Success')
);




//console.log(Models.Movies)

const app = express();
//console.log(Users.find());
// var myLogger = (req, res, next) => {
//   console.log(req.url);
//   next();
// }

// var requestTime = (req, res, next) => {
//   req.requestTime = Date.now();
//   next();
// }

app.use(morgan('common'));
app.use(bodyParser.json())
app.use(express.static('public',{root: __dirname}));
var auth = require('./auth')(app);

/**********************
      Get request
**********************/


app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('something broke');
})

//get movies
app.get('/movies', passport.authenticate('jwt',{session: false}), (req, res) => {
  Movies.find()
  .then(movies => res.json(movies))
  .catch(err => res.status(500).send("Error: "+ err))
});

app.get('/movies/:title', (req, res) => {
  const movie = req.params.title;
  Movies.findOne({Title: movie})
  .then(movie => {
    res.status(200).json(movie)
  })
  .catch(err => res.status(500).send("Error: "+ err))
});

app.get('/movies/:title/:genre', (req, res) => {
  const movieTitle = req.params.title;
  const genre = req.params.genre;
  Movies.findOne({Title: movieTitle})
  .where('Genre.Name').equals(genre)
  .then(movie => {
    console.log(movie.Genre.Name)
    res.status(200).json({description:movie.Genre.Description, movie:movie})
  })
  .catch(err => res.status(500).send("Error: "+ err))
})

app.get('/directors/:name', (req, res) => {
  Movies.findOne({"Director.Name": req.params.name})
  .then(movie => {
    res.json(movie.Director)
  })
  .catch(err => res.status(500).send("Error: "+ err))
});

/**********************
  Users Get request
**********************/

app.get('/users', (req, res) => {
  Users.find()
  .then(users => res.json(users))
  .catch(err => res.status(500).send("Error:" + err))
});


app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if(user) {
      return res.status(400).send(req.body.Username + " already exist");
    }else {
      Users.create ({
        Username: req.body.Username,
        Password: req.body.Email,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {
        res.status(201).json(user)
      })
      .catch(err => {
        console.log(err);
        res.status(500).send("Error: " + err)
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Error: " + err)
  })
});

app.get('/users/:username', (req, res) => {
  Users.findOne({Username: req.params.username})
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => res.status(500).send("Error: "+err))
});

app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.username}, {$set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }},
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.log(err);
      res.status(500).send("Error: "+ err)
    }else {
      res.json(updatedUser)
    }
  }
  )
});


app.post('/users/:username/movies/:movieId', (req, res) => {
  console.log(req.params.movieId)
 Users.findOneAndUpdate({Username: req.params.username},
   {$push: {FavoriteMovies: req.params.movieId}},
   {new: true},
   (err, updatedUser) => {
     if(err) {
       console.log(err);
       res.status(500).send("Error: "+ err)
     }else {
       res.json(updatedUser)
     }
   }
   )
});

app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({Username: req.params.username})
  .then(user => {
    if(!user) {
      res.status(400).send(req.params.username + " does not exit")
    }else{
      res.status(200).send(req.params.username + " was deleted")
    }
  })
  .catch(err => res.status(500).send("Error: "+err))
})




app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname})
});



/**********************
  Listens for requests
**********************/
app.listen(8000, () => {
  console.info('*******************************');
  console.info('App is Listening on Port 8000');
  console.info('*******************************');
});