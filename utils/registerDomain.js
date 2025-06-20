import axios from 'axios';

export async function registerDomain(domain) {
  const { DYNADOT_API_KEY } = process.env;

  const params = {
    key: DYNADOT_API_KEY,
    command: 'register',
    domain,
    payment_type: 'account', // or 'prepay' depending on your Dynadot config
    // You can optionally add: duration, ns, privacy, etc.
  };

  const response = await axios.post('https://api.dynadot.com/api3.json', null, { params });

  if (response.data.ResponseCode !== '0') {
    throw new Error(response.data.Response || 'Unknown error');
  }

  return {
    message: '✅ Domain registered successfully!',
    domain,
    response: response.data,
  };
}
