const { Sequelize } = require('sequelize');
const sequelize = require('../db'); // Asegurate de tener tu conexión en db.js

const TestResult = require('./TestResult')(sequelize);
const Prediction = require('./Prediction')(sequelize);
const TraitOrder = require('./TraitOrder')(sequelize);
const Match = require('./Match')(sequelize);

// Relaciones
Prediction.belongsTo(TestResult, { foreignKey: 'test_id' });
TestResult.hasMany(Prediction, { foreignKey: 'test_id' });

TraitOrder.belongsTo(TestResult, { foreignKey: 'test_id' });
TestResult.hasMany(TraitOrder, { foreignKey: 'test_id' });

Match.belongsTo(TestResult, { foreignKey: 'test_id' });
TestResult.hasMany(Match, { foreignKey: 'test_id' });

module.exports = {
  sequelize,
  TestResult,
  Prediction,
  TraitOrder,
  Match,
};
