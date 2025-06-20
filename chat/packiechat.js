export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === "/chat") {
      try {
        const { message } = await request.json();
        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            {
              role: 'system',
              content: `You are Packie, a witty but helpful tech-savvy assistant who explains the importance of having an online presence for creators, freelancers, and business owners. Be concise, charming, and never cringy.`
            },
            { role: 'user', content: message }
          ]
        });

        return new Response(
          JSON.stringify({ reply: response.choices[0].message.content }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders()
            }
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: 'Chat failed.', details: err.message }),
          { status: 500, headers: corsHeaders() }
        );
      }
    }

    return new Response('🌐 Packie is online. Try POSTing to /chat.', {
      headers: corsHeaders()
    });
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
