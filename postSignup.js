<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Choose Your Plan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 2em;
    }
    .hidden { display: none; }
    input, select, button {
      display: block;
      margin-top: 1em;
      width: 100%;
      padding: 0.5em;
    }
    .success {
      color: green;
      margin-top: 2em;
    }
  </style>
</head>
<body>
  <h1>Claim Your Spot Online</h1>
  <form id="planForm">
    <input type="text" id="name" placeholder="Your Name" required>
    <input type="email" id="email" placeholder="Your Email" required>

    <label><input type="radio" name="plan" value="free" checked> Free Subdomain</label>
    <label><input type="radio" name="plan" value="paid"> Paid Custom Domain + Google Suite</label>

    <div id="paidOptions" class="hidden">
      <p>We'll email you when it's ready or enter your card details below to pre-register.</p>
      <input type="text" id="cardInfo" placeholder="Card Info (Optional)">
    </div>

    <button type="submit">Claim</button>
  </form>

  <p id="message" class="success"></p>

  <script type="module">
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

    const supabase = createClient(
      'https://qaegmajxjdfqtispqdnt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZWdtYWp4amRmcXRpc3BxZG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDk2OTUsImV4cCI6MjA2NTg4NTY5NX0.DmO2FMufZ7LBVY3nVOv0r0P7HuD4kvgKjBy8cC-MjJw'
    );

    document.querySelectorAll('input[name="plan"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.getElementById('paidOptions').classList.toggle('hidden', radio.value !== 'paid');
      });
    });

    document.getElementById('planForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const plan = document.querySelector('input[name="plan"]:checked').value;
      const cardInfo = document.getElementById('cardInfo').value.trim();

      const domainType = plan === 'paid' ? 'custom' : 'subdomain';
      const domainValue = plan === 'paid' ? `${name.toLowerCase()}.com` : `${name.toLowerCase()}.pacmacmobile.com`;

      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('https://packiepresents.onrender.com/save-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: domainType, domain: domainValue })
      });

      const msg = await response.text();
      document.getElementById('message').innerText = `✅ ${msg}`;

      // Send email or cardInfo to internal db or placeholder API if needed
      console.log({ email, name, plan, cardInfo });
    });
  </script>
</body>
</html>
