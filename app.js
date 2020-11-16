const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')
const cookieParser = require('cookie-parser')
const requireAuth = require('./middleware/authMiddleware')

const app = express();

//--------------------------------------------------------------
// MIDDLEWARE
//--------------------------------------------------------------

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

//--------------------------------------------------------------
// VIEW ENGINE
//--------------------------------------------------------------

app.set('view engine', 'ejs');

//--------------------------------------------------------------
// DATABASE CONNECTION
//--------------------------------------------------------------

mongoose.connect(
    process.env.dbURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }
  )
  .then(() => app.listen(3000, ()=> console.log('connected to server')))
  .catch((err) => console.log(err));

//--------------------------------------------------------------
// ROUTES
//--------------------------------------------------------------

app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use('/', require('./routes/authRoutes'))

//--------------------------------------------------------------
// SAMPLE COOKIES
//--------------------------------------------------------------

app.get('/set-cookies', (req, res) => {
  res.setHeader('Set-Cookie', 'newUser=godfrey')
  res.cookie('newUser', false)
  res.cookie('isEmail', true)

  res.send('you got the cookies')
});

app.get('/get-cookies', (req, res) => {

  const cookies = req.cookies
  res.json(cookies)
});