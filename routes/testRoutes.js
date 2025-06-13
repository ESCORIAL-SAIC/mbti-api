const express = require('express');
const axios = require('axios');
const { TestResult, Prediction, TraitOrder, Match } = require('../models');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const BACKEND_URL = process.env.BACKEND_URL;

/**
 * @swagger
 * /create-test:
 *   post:
 *     summary: Crea un nuevo test para un usuario
 *     tags:
 *       - Test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *     responses:
 *       200:
 *         description: Test creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 test_id:
 *                   type: string
 *                 test_url:
 *                   type: string
 *       409:
 *         description: Ya existe un test con ese nombre
 *       500:
 *         description: Error al crear el test
 */
router.post('/create-test', async (req, res) => {
  try {
    const { name, fullName } = req.body;

    const existingTest = await TestResult.findOne({
        where: { name: name }
    })
    if (existingTest)
        return res.status(409).json({ error: 'Ya se encuentra un test realizado por este usuario.', testUrl: `${BACKEND_URL}/api/get-test?name=${name}` });

    const response = await axios.get(`${BASE_URL}new_test`, {
      params: {
        api_key: API_KEY,
        notify_url: `${BACKEND_URL}/api/test-callback`,
        name_of_tester: fullName || name || 'Usuario',
        company_name: 'Escorial SAIC',
        theme_color: '#2b74b7'
      },
    });

    const { test_id, test_url } = response.data.data;

    await TestResult.create({ id: test_id, name: name, test_url: test_url });
    return res.json({ test_id, test_url, translated_test_url: `${BACKEND_URL}/proxy/test/${test_id}` });
  } catch (error) {
    console.error('Error creando test:', error);
    return res.status(500).json({ error: 'No se pudo crear el test' });
  }
});

/**
 * @swagger
 * /test-callback:
 *   get:
 *     summary: Callback del test externo para guardar resultados
 *     tags:
 *       - Test
 *     parameters:
 *       - in: query
 *         name: test_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del test recibido desde el servicio externo
 *     responses:
 *       200:
 *         description: Resultados del test guardados correctamente
 *       400:
 *         description: Falta el parámetro test_id
 *       500:
 *         description: Error al guardar los resultados del test
 */
router.get('/test-callback', async (req, res) => {
    const { test_id } = req.query;

    if (!test_id) return res.status(400).send('Falta test_id');

    try {
        const response = await axios.get(`${BASE_URL}check_test`, {
        params: {
        api_key: API_KEY,
        test_id,
      },
    });

    const data = response.data.data;

    console.log("test", data)

    await TestResult.update(
      {
        prediction: data.prediction,
        result_date: data.result_date,
        results_page: data.results_page,
      },
      { where: { id: test_id } }
    );

    const predEntries = Object.entries(data.predictions);
    await Promise.all(
      predEntries.map(([type, score]) =>
        Prediction.create({ test_id, type, score })
      )
    );

    const conscious = data.trait_order_conscious;
    const shadow = data.trait_order_shadow;

    const traitMap = [
      ...Object.entries(conscious).map(([role, func]) => ({
        test_id,
        trait_type: 'conscious',
        role,
        function_code: func,
      })),
      ...Object.entries(shadow).map(([role, func]) => ({
        test_id,
        trait_type: 'shadow',
        role,
        function_code: func,
      })),
    ];

    await TraitOrder.bulkCreate(traitMap);

    const matches = Object.values(data.matches).map((desc, i) => ({
        test_id,
        match_order: i + 1,
        description: desc,
    }));

    await Match.bulkCreate(matches);
    return res.status(200).send('Test completado y guardado');
  } catch (error) {
    console.error('Error guardando resultado:', error);
    return res.status(500).send('Error procesando el test');
  }
});

/**
 * @swagger
 * /get-test:
 *   get:
 *     summary: Obtener los resultados de un test por ID
 *     tags:
 *       - Tests
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Usuario de la persona a consultar
 *     responses:
 *       200:
 *         description: Test encontrado y datos devueltos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     test_url:
 *                       type: string
 *                       example: "https://devil.ai/api-personality-test/ee9bb215492b421c5f6a5fa4808b74cf684ac58823589718619680"
 *                     prediction:
 *                       type: string
 *                       example: "INTP"
 *                     predictions:
 *                       type: object
 *                       example: 
 *                         INTP: 4
 *                         ISTP: 4
 *                         ENTJ: 2
 *                         ISFP: 2
 *                         ESTJ: 2
 *                         INFP: 2
 *                         ISFJ: 1
 *                         INFJ: 1
 *                         INTJ: 1
 *                         ISTJ: 1
 *                         ESFJ: 0
 *                         ENFJ: 0
 *                         ENTP: -1
 *                         ESFP: -1
 *                         ESTP: -1
 *                         ENFP: -1
 *                     trait_order_conscious:
 *                       type: object
 *                       properties:
 *                         hero:
 *                           type: string
 *                           example: "ti"
 *                         parent:
 *                           type: string
 *                           example: "ni"
 *                         child:
 *                           type: string
 *                           example: "si"
 *                         inferior:
 *                           type: string
 *                           example: "fi"
 *                     trait_order_shadow:
 *                       type: object
 *                       properties:
 *                         nemesis:
 *                           type: string
 *                           example: "te"
 *                         critic:
 *                           type: string
 *                           example: "se"
 *                         trickster:
 *                           type: string
 *                           example: "ne"
 *                         demon:
 *                           type: string
 *                           example: "fe"
 *                     matches:
 *                       type: object
 *                       example:
 *                         "0": "Matching <a target=\"_blank\" href=\"https://devil.ai/INTP\" class=\"tag tag_t label_intp \" title=\"\">INTP</a> high conscious trait."
 *                         "1": "Matching <a target=\"_blank\" href=\"https://devil.ai/ENFJ\" class=\"tag tag_f label_enfj \" title=\"\">ENFJ</a> second highest conscious trait."
 *                         "2": "Matching <a target=\"_blank\" href=\"https://devil.ai/INFP\" class=\"tag tag_f label_infp \" title=\"\">INFP</a> second lowest conscious trait."
 *                         "3": "Matching <a target=\"_blank\" href=\"https://devil.ai/ENTJ\" class=\"tag tag_t label_entj \" title=\"\">ENTJ</a> lowest conscious trait."
 *                         "4": "Matching <a target=\"_blank\" href=\"https://devil.ai/INTP\" class=\"tag tag_t label_intp \" title=\"\">INTP</a> high unconscious trait."
 *                         "5": "Matching <a target=\"_blank\" href=\"https://devil.ai/ESFJ\" class=\"tag tag_f label_esfj \" title=\"\">ESFJ</a> second highest unconscious trait."
 *                         "6": "Matching <a target=\"_blank\" href=\"https://devil.ai/ISFP\" class=\"tag tag_f label_isfp \" title=\"\">ISFP</a> second lowest unconscious trait."
 *                         "7": "Matching <a target=\"_blank\" href=\"https://devil.ai/ENTJ\" class=\"tag tag_t label_entj \" title=\"\">ENTJ</a> lowest unconscious trait."
 *                     test_id:
 *                       type: string
 *                       example: "ee9bb215492b421c5f6a5fa4808b74cf684ac58823589718619680"
 *                     result_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-12T14:20:58.000Z"
 *                     results_page:
 *                       type: string
 *                       example: "https://devil.ai/r/ee9bb215492b421c5f6a5fa4808b74cf684ac58823589718619680"
 *       400:
 *         description: Parámetro test_id faltante o inválido
 *       404:
 *         description: Test no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/get-test', async (req, res) => {
  try {
    const { name } = req.query;
    const test = await TestResult.findOne({
      where: { name }
    });
    if (!test) {
      return res.status(404).json({ error: 'No se encontró un test para este usuario' });
    }

    const predictions = await Prediction.findAll({ where: { test_id: test.id } });
    const traitOrders = await TraitOrder.findAll({ where: { test_id: test.id } });
    const matches = await Match.findAll({ where: { test_id: test.id } });

    const predictionsObj = {};
    predictions.forEach(p => {
      predictionsObj[p.type] = p.score;
    });

    const trait_order_conscious = {};
    const trait_order_shadow = {};
    traitOrders.forEach(t => {
      if (t.trait_type === 'conscious') {
        trait_order_conscious[t.role] = t.function_code;
      } else if (t.trait_type === 'shadow') {
        trait_order_shadow[t.role] = t.function_code;
      }
    });

    const matchesObj = {};
    matches.forEach((m, i) => {
      matchesObj[i] = m.description;
    });

    return res.status(200).json({
      data: {
        test_url: test.test_url,
        translated_test_url: `${BACKEND_URL}/proxy/test/${test.id}`,
        prediction: test.prediction,
        predictions: predictionsObj,
        trait_order_conscious,
        trait_order_shadow,
        matches: matchesObj,
        test_id: test.id,
        result_date: test.result_date,
        results_page: test.results_page,
        translated_results_page: test.results_page
          ? `${BACKEND_URL}/proxy/result/${test.id}`
          : null
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/delete-test', async (req, res) => {
  const { name } = req.body;
  try {
    const testResult = await TestResult.findOne({ where: { name } });
    if (!testResult)
      return res.status(404).json({ error: 'No se encontró un test para este usuario' });

    await Match.destroy({ where: { test_id: testResult.id } });
    await Prediction.destroy({ where: { test_id: testResult.id } });
    await TraitOrder.destroy({ where: { test_id: testResult.id } });
    await testResult.destroy();

    res.json({ message: 'Test eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el test' });
  }
});

router.get('/get-all-tests', async (req, res) => {
  try {
    const tests = await TestResult.findAll()
    if (!tests) 
      return res.status(404).json({ error: 'No se encontraron tests' })
    const response = []

    tests.forEach(test => {
      const item = {
        name: test.name,
        testUrl: `${BACKEND_URL}/api/get-test?name=${test.name}`
      }
      response.push(item)
    })

    return res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
  
})

module.exports = router;