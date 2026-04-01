const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  // GET /api/projects/[id] — return full content for one project
  if (req.method === 'GET') {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?select=content&id=eq.${id}`,
      { headers }
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });
    if (!data.length) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ content: data[0].content });
  }

  // DELETE /api/projects/[id]
  if (req.method === 'DELETE') {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: err });
    }
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
