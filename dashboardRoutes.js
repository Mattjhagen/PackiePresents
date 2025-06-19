// dashboardRoutes.js
module.exports = function(app) {
  app.get('/api/me', (req, res) => {
    if (!req.user) return res.status(401).send('Not logged in');

    res.json({
      name: req.user.displayName,
      email: req.user.emails[0].value
    });
  });

  app.post('/api/submit-plan', (req, res) => {
    if (!req.user) return res.status(401).send('Unauthorized');

    const { plan } = req.body;
    const userEmail = req.user.emails[0].value;

    if (!plan) return res.status(400).send('No plan selected');

    // Future: Store plan in DB and trigger subdomain/domain logic
    console.log(`🔔 ${userEmail} selected plan: ${plan}`);

    if (plan === 'paid') {
      res.send('Thanks! We’ll email you with steps to connect your custom domain.');
    } else {
      res.send(`Your free subdomain (like yourname.pacmacmobile.com) will be created soon.`);
    }
  });
};
