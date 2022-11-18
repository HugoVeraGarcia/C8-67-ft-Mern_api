const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const Enterprise = db.define('enterprise', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  enterprisename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  foodtype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prefphone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeperson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enterpriserfc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  legalreprefirstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  legalreprelastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reprerfc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identityrepre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
});

module.exports = { Enterprise };
