/**
 * @swagger
 * components:
 *   schemas:
 *     TestResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         prediction:
 *           type: string
 *         result_date:
 *           type: string
 *           format: date-time
 *         results_page:
 *           type: string
 *         name:
 *           type: string
 *         test_url:
 *           type: string
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TestResult = sequelize.define('TestResult', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    prediction: {
      type: DataTypes.STRING(4),
    },
    result_date: {
      type: DataTypes.DATE,
    },
    results_page: {
      type: DataTypes.TEXT,
    },
    name: {
        type: DataTypes.TEXT
    },
    test_url: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: false,
    tableName: 'TestResults',
});

  return TestResult;
};
