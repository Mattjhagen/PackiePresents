// signupHandler.js
const { saveUserDomain } = require('./saveDomain');

module.exports = function (app) {
  app.post('/signup', (req, res) => {
    const { name, email, plan } = req.body;

    if (!name || !email || !plan) {
      return res.status(400).send('Missing fields');
    }

    console.log(`📥 Signup received: ${name}, ${email}, ${plan}`);

    const sanitized = name.replace(/\s+/g, '').toLowerCase();

    if (plan === 'paid') {
      // Save custom domain for paid users
      const customDomain = `${sanitized}.com`;
      saveUserDomain(email, 'custom', customDomain);

      return res.send('Thanks for signing up! We’ll reach out about your custom domain.');
    }

    // Save free subdomain for other users
    const subdomain = `${sanitized}.pacmacmobile.com`;
    saveUserDomain(email, 'subdomain', subdomain);

    res.send(`Welcome, ${name}! Your free subdomain will be generated soon.`);
  });
};
