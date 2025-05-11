// exchange-token.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { code } = JSON.parse(event.body);
  const client_id     = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  // Exchange code for access_token
  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({ client_id, client_secret, code })
  });
  const { access_token, error, error_description } = await resp.json();
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error, error_description })
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ access_token })
  };
};
