const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Team, Employee, EmployeeTeam, Log } = require('../models');

router.use(auth);

router.get('/', async (req, res) => {
  const teams = await Team.findAll({ where: { organisationId: req.user.orgId }, include: Employee });
  res.json(teams);
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const t = await Team.create({ name, description, organisationId: req.user.orgId });
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'team_created', meta: { teamId: t.id }});
  res.status(201).json(t);
});

router.put('/:id', async (req, res) => {
  const t = await Team.findByPk(req.params.id);
  if(!t || t.organisationId !== req.user.orgId) return res.status(404).json({ message: 'Not found' });
  await t.update(req.body);
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'team_updated', meta: { teamId: t.id }});
  res.json(t);
});

router.delete('/:id', async (req, res) => {
  const t = await Team.findByPk(req.params.id);
  if(!t || t.organisationId !== req.user.orgId) return res.status(404).json({ message: 'Not found' });
  await t.destroy();
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'team_deleted', meta: { teamId: t.id }});
  res.json({ message: 'Deleted' });
});

// assign employee(s) to team
router.post('/:id/assign', async (req, res) => {
  const team = await Team.findByPk(req.params.id);
  if(!team || team.organisationId !== req.user.orgId) return res.status(404).json({ message: 'Not found' });
  const { employeeId, employeeIds } = req.body;
  const ids = employeeIds || (employeeId ? [employeeId] : []);
  for(const id of ids){
    await EmployeeTeam.findOrCreate({ where: { teamId: team.id, employeeId: id }});
    await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'employee_assigned', meta: { employeeId: id, teamId: team.id }});
  }
  res.json({ message: 'Assigned' });
});

router.post('/:id/unassign', async (req, res) => {
  const { employeeId } = req.body;
  await EmployeeTeam.destroy({ where: { teamId: req.params.id, employeeId }});
  await Log.create({ organisationId: req.user.orgId, userId: req.user.id, action: 'employee_unassigned', meta: { employeeId, teamId: req.params.id }});
  res.json({ message: 'Unassigned' });
});

module.exports = router;
