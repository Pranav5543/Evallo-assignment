const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Log, User } = require('../models');

router.use(auth);

router.get('/', async (req, res) => {
  const logs = await Log.findAll({ where: { organisationId: req.user.orgId }, include: User, order:[['createdAt','DESC']], limit: 200 });
  res.json(logs);
});

module.exports = router;
