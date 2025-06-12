/**
 * @swagger
 * components:
 *   schemas:
 *     Prediction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         test_id:
 *           type: string
 *         type:
 *           type: string
 *         score:
 *           type: integer
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prediction = sequelize.define('Prediction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(4),
    },
    score: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    tableName: 'Predictions',
});

  return Prediction;
};
