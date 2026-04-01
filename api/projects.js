const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET  /api/projects  — return list (no content, keep response small)
  if (req.method === 'GET') {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?select=id,name,filename,created_at&order=created_at.desc`,
      { headers }
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });
    return res.status(200).json(data);
  }

  // POST /api/projects  — upsert a project (name + filename + content)
  if (req.method === 'POST') {
    const { name, filename, content } = req.body;
    if (!name || !filename || !content) {
      return res.status(400).json({ error: 'name, filename, and content are required' });
    }
    const r = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ name, filename, content }),
    });
    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: err });
    }
    return res.status(201).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
