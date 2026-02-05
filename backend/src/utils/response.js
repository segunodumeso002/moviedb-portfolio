const response = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...headers
  },
  body: JSON.stringify(body)
});

const success = (data) => response(200, { success: true, data });
const error = (message, statusCode = 400) => response(statusCode, { success: false, error: message });

module.exports = { response, success, error };