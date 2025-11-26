const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');
require('dotenv').config();
const router = express.Router();

router.post('/register', async (req, res) => {
  const { orgName, adminName, email, password } = req.body;
  if(!orgName || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const org = await Organisation.create({ name: orgName });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: adminName, email, password_hash: hash, organisationId: org.id });
    const token = jwt.sign({ userId: user.id, orgId: org.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    await Log.create({ organisationId: org.id, userId: user.id, action: 'organisation_created', meta: { orgName }});
    res.json({ token, user: { id: user.id, name: user.name, email: user.email }});
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error creating account' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const user = await User.findOne({ where: { email }});
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, orgId: user.organisationId }, process.env.JWT_SECRET, { expiresIn: '8h' });
    await Log.create({ organisationId: user.organisationId, userId: user.id, action: 'user_logged_in', meta: {}});
    res.json({ token, user: { id: user.id, name: user.name, email: user.email }});
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  const { userId, orgId } = req.body;
  try {
    await Log.create({ organisationId: orgId, userId, action: 'user_logged_out', meta: {}});
    res.json({ message: 'Logged out' });
  } catch(err){
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
