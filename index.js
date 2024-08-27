// const http = require('http');
// const fs = require('fs');
// const fsPromise = require('fs').promises;
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/cors');
const PORT = process.env.PORT || 3500;

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/documents',require('./routes/api/documents'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));