import supabase from './supabaseClient.js';

app.get('/auth/supabase', async (req, res) => {
  const redirectUrl = 'https://your-frontend.com/supabase-callback'; // update to your domain
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl }
  });

  if (error) {
    return res.status(500).send('Error with Supabase OAuth');
  }

  res.redirect(data.url);
});
