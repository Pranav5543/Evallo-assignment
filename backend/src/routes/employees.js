const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Employee, Log, Team } = require('../models');

router.use(auth);

router.get('/', async (req, res) => {
  const list = await Employee.findAll({ where: { organisationId: req.user.orgId }, include: Team });
  res.json(list);
});

router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  const emp = await Employee.create({ first_name, last_name, email, phone, organisationId: req.user.orgId });
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'employee_created', meta: { employeeId: emp.id }});
  res.status(201).json(emp);
});

router.put('/:id', async (req, res) => {
  const emp = await Employee.findByPk(req.params.id);
  if(!emp || emp.organisationId !== req.user.orgId) return res.status(404).json({ message: 'Not found' });
  await emp.update(req.body);
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'employee_updated', meta: { employeeId: emp.id }});
  res.json(emp);
});

router.delete('/:id', async (req, res) => {
  const emp = await Employee.findByPk(req.params.id);
  if(!emp || emp.organisationId !== req.user.orgId) return res.status(404).json({ message: 'Not found' });
  await emp.destroy();
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'employee_deleted', meta: { employeeId: req.params.id }});
  res.json({ message: 'Deleted' });
});

module.exports = router;
