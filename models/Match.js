/**
 * @swagger
 * components:
 *   schemas:
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         test_id:
 *           type: string
 *         match_order:
 *           type: integer
 *         description:
 *           type: string
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    match_order: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: false,
    tableName: 'Matches',
});

  return Match;
};
