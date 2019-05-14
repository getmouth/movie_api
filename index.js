const express = require('express');
const app = express();

let topBooks = [
  {
    title: "Harry Porter and the Sorcerer's Stone",
    author: "J.K. Rowling"
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien"
  },
  {
    title: "Twilight",
    author: "Stephanie Meyer"
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to my book club');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname})
})