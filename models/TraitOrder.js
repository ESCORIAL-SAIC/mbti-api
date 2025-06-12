/**
 * @swagger
 * components:
 *   schemas:
 *     TraitOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         test_id:
 *           type: string
 *         trait_type:
 *           type: string
 *         role:
 *           type: string
 *         function_code:
 *           type: string
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TraitOrder = sequelize.define('TraitOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    trait_type: {
      type: DataTypes.STRING(20),
    },
    role: {
      type: DataTypes.STRING(20),
    },
    function_code: {
      type: DataTypes.STRING(2),
    },
  }, {
    timestamps: false,
    tableName: 'TraitOrder',
});

  return TraitOrder;
};
