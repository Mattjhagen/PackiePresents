// signupHandler.js
module.exports = function (app) {
  app.post('/signup', (req, res) => {
    const { name, email, plan } = req.body;

    if (!name || !email || !plan) {
      return res.status(400).send('Missing fields');
    }

    console.log(`Signup received: ${name}, ${email}, ${plan}`);

    if (plan === 'paid') {
      // Trigger domain/Google Suite purchase automation here
      return res.send('Thanks for signing up! We’ll reach out about your custom domain.');
    }

    res.send(`Welcome, ${name}! Your free subdomain will be generated soon.`);
  });
};
