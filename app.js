const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(
    process.env.dbURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }
  )
  .then(() => app.listen(3000, ()=> console.log('connected to server')))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use('/', require('./routes/authRoutes'))