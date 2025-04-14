const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
}));

// Sync DB and start server
sequelize.sync().then(() => {
  console.log('DB Synced');
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});

app.use('/', authRoutes);

// //Sync DB
// sequelize.sync({ force: true }).then(() => {
//     console.log('DB Synced');
//     app.listen(3000, () => console.log('Server running on http://localhost:3000'));
//   });
  