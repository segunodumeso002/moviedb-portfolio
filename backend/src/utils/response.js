const response = (statusCode, body, headers = {}) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://mymoviepalour.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Credentials': 'false'
  };
  
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      ...headers
    },
    body: JSON.stringify(body)
  };
};

const success = (data) => response(200, { success: true, data });
const error = (message, statusCode = 400) => response(statusCode, { success: false, error: message });

module.exports = { response, success, error };