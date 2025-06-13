const puppeteer = require('puppeteer');
require('dotenv').config();

app.get('/test/:id', async (req, res) => {
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

app.get('/result/:id', async (req, res) => {
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
