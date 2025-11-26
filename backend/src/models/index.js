const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organisation = sequelize.define('organisation', {
  name: { type: DataTypes.STRING, allowNull: false }
});

const User = sequelize.define('user', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password_hash: DataTypes.STRING
});

const Employee = sequelize.define('employee', {
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING
});

const Team = sequelize.define('team', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT
});

const EmployeeTeam = sequelize.define('employee_team', {
  assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Log = sequelize.define('log', {
  action: DataTypes.STRING,
  meta: DataTypes.JSONB
});

// Relations
Organisation.hasMany(User, { onDelete: 'CASCADE' });
User.belongsTo(Organisation);

Organisation.hasMany(Employee, { onDelete: 'CASCADE' });
Employee.belongsTo(Organisation);

Organisation.hasMany(Team, { onDelete: 'CASCADE' });
Team.belongsTo(Organisation);

Employee.belongsToMany(Team, { through: EmployeeTeam, onDelete: 'CASCADE' });
Team.belongsToMany(Employee, { through: EmployeeTeam, onDelete: 'CASCADE' });

Organisation.hasMany(Log);
Log.belongsTo(Organisation);
User.hasMany(Log);
Log.belongsTo(User);

module.exports = {
  sequelize, Organisation, User, Employee, Team, EmployeeTeam, Log: Log
};
