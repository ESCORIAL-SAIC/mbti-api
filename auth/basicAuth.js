require('dotenv').config();

const USER_AUTH = process.env.USER_AUTH
const PASS_AUTH = process.env.PASS_AUTH

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const validUsername = USER_AUTH;
  const validPassword = PASS_AUTH;

  if (username === validUsername && password === validPassword) {
    return next();
  }

  return res.status(403).send('Access denied.');
};

module.exports = basicAuth;