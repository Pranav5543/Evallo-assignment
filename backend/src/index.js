const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');
const { Organisation, User, Employee, Team, EmployeeTeam, Log } = require('./models');

const authRouter = require('./routes/auth');
const empRouter = require('./routes/employees');
const teamRouter = require('./routes/teams');
const logRouter = require('./routes/logs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/employees', empRouter);
app.use('/api/teams', teamRouter);
app.use('/api/logs', logRouter);

const PORT = process.env.PORT || 5000;

async function start(){
  await sequelize.sync();
  app.listen(PORT, () => console.log('Server listening on', PORT));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
