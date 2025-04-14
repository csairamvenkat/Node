const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { name, password,email } = req.body;
  console.log('Received:', { name, email, password }); // Add this to debug
  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required.");
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, password: hashed ,email});
    res.redirect('/login');
  } catch (err) {
    res.send('Error registering user: ' + err);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { name } });
    if (!user) return res.send('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.send('Invalid password');

    // JWT or session
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    res.send('Login error: ' + err);
  }
};

exports.dashboard = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user });
};
