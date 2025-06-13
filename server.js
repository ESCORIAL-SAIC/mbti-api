const express = require('express');
const puppeteer = require('puppeteer');
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

app.get('/proxy/test/:id', async (req, res) => {
  const id = req.params.id;
  const url = `https://devil-ai.translate.goog/api-personality-test/${id}?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=wapp`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        iframe#gt-nvframe,
        iframe[src*="translate.google.com"] {
          display: none !important;
        }
        body {
          margin-top: 0 !important;
        }
      `;
      document.head.appendChild(style);
    });

    const content = await page.content();
    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al cargar la página traducida con Puppeteer');
  }
});

app.get('/proxy/result/:id', async (req, res) => {
  const id = req.params.id;
  const url = `https://devil-ai.translate.goog/r/${id}?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=wapp`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        iframe#gt-nvframe,
        iframe[src*="translate.google.com"] {
          display: none !important;
        }
        body {
          margin-top: 0 !important;
        }
      `;
      document.head.appendChild(style);
    });

    const content = await page.content();
    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al cargar la página traducida con Puppeteer');
  }
});

sequelize.sync();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentacion en ${PORT}/api-docs`)
});