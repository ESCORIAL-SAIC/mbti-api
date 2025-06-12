const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const testRoutes = require('./routes/testRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors())

const BACKEND_URL = process.env.BACKEND_URL;
const PORT = process.env.PORT;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Escorial MBTI test API documentation.',
      version: '1.0.0',
      description: 'API doc.',
    },
    servers: [
      {
        url: `${BACKEND_URL}/api`,
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], 
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());

app.use('/api', testRoutes);


app.get('/', (req, res) => {
  res.send('Nothing to see here. Please refer to /api-docs or GitHub repo (https://github.com/ESCORIAL-SAIC/mbti-api) for documentation.');
});

sequelize.sync();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentacion en ${PORT}/api-docs`)
});