// db.js
const mongoose = require('mongoose');

let   dbURL = process.env.DB_URL;



mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB URL:', dbURL);
});

module.exports = mongoose;
