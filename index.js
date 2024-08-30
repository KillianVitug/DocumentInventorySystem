require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/cors');
const session = require('express-session');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');
const PORT = process.env.PORT || 3500;

//Connect DB
connectDB();

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data form data
app.use(express.urlencoded({ extended: false }));

// middleware for session message
app.use(
  session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// built-in middleware for json
app.use(express.json());

// set template engine
app.set('view engine', 'ejs');

//serve static files
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('/uploads'));

//routes
app.use('/', require('./routes/root'));
app.use('/documents', require('./routes/api/documents'));

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
