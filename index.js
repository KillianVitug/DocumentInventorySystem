require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/cors');
const session = require('express-session');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const documentsRoutes = require('./routes/api/documents');
const PORT = process.env.PORT || 3500;

//Connect DB
connectDB();

app.use(credentials); // Handle credentials before CORS

// Apply CORS to all routes
app.use(cors(corsOptions));

// Ensure preflight requests are handled
app.options('*', cors(corsOptions));
// built-in middleware to handle urlencoded data form data
app.use(express.urlencoded({ extended: true }));

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

//middleware for cookies
app.use(cookieParser());

// set template engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/login'));
app.use('/profile', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/documents', documentsRoutes);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
