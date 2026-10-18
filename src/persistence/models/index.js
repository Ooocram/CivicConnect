// src/persistence/models/index.js
// PERSISTENCE LAYER: Sequelize connection + the four M2 baseline entities
// (User, Category, ServiceRequest) plus Comment, which FR-04 requires.
// Table names follow Sequelize defaults (Users, Categories, ServiceRequests, Comments)
// and match migrations/20261013000000-create-core-schema.js.
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../../config/database');

const env = process.env.NODE_ENV || 'development';
const cfg = dbConfig[env];
const url = process.env[cfg.use_env_variable];
if (!url) {
  throw new Error(`Missing ${cfg.use_env_variable} environment variable (see .env.example).`);
}

// DB_POOL_MAX is a tuning knob (default 5 = Sequelize's default). The Task C load test compared
// pool sizes 5 and 20 (3 runs each); the difference was within run-to-run variation, so the
// default was kept. See docs/performance/load-test-report.md.
const sequelize = new Sequelize(url, {
  dialect: cfg.dialect,
  logging: false,
  pool: { max: Number(process.env.DB_POOL_MAX) || 5 },
});

const User = sequelize.define('User', {
  name:  { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  role:  { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'requester' }, // 'requester' | 'staff'
});

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
});

const ServiceRequest = sequelize.define('ServiceRequest', {
  trackingId:  { type: DataTypes.STRING(20), allowNull: false, unique: true },
  title:       { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  location:    { type: DataTypes.STRING(255), allowNull: true },
  status:      { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'Open' }, // Open | In Progress | Resolved
  categoryId:  { type: DataTypes.INTEGER, allowNull: true },
  resolvedAt:  { type: DataTypes.DATE, allowNull: true },
  resolvedBy:  { type: DataTypes.INTEGER, allowNull: true },
  assignedTo: { type: DataTypes.INTEGER, allowNull: true },
});

const Comment = sequelize.define('Comment', {
  requestId: { type: DataTypes.INTEGER, allowNull: false },
  authorId:  { type: DataTypes.INTEGER, allowNull: false },
  body:      { type: DataTypes.TEXT, allowNull: false },
  type:      { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'GENERAL' }, // 'GENERAL' | 'RESOLUTION'
});

ServiceRequest.belongsTo(Category, { foreignKey: 'categoryId' });
ServiceRequest.belongsTo(User, { as: 'resolver', foreignKey: 'resolvedBy' });
ServiceRequest.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
ServiceRequest.hasMany(Comment, { foreignKey: 'requestId' });
Comment.belongsTo(ServiceRequest, { foreignKey: 'requestId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = { sequelize, Sequelize, User, Category, ServiceRequest, Comment };
