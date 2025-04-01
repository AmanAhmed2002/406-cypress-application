
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  // Replace process.env.JWT_SECRET with your key or use Supabase's public key if available.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

async function attachUserRole(req, res, next) {
  const { id } = req.user;
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  req.user.role = profile.role;
  next();
}

module.exports = { authenticateToken, attachUserRole };

