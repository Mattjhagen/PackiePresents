// utils/dynadot.js
import axios from 'axios';

export async function registerDomain(domain) {
  try {
    const response = await axios.post('https://api.dynadot.com/api3.json', null, {
      params: {
        key: process.env.DYNADOT_API_KEY,
        command: 'register',
        domain,
        payment_method: 'account_balance', // Or use 'credit_card' etc.
        duration: 1,
      },
    });

    return response.data;
  } catch (err) {
    console.error('❌ Dynadot API error:', err.response?.data || err.message);
    throw err;
  }
}