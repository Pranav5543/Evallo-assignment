const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

async function auth(req, res, next){
  if(req.method === 'OPTIONS') return next();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: user.id, orgId: user.organisationId };
    next();
  } catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
