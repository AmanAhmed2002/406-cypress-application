
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  // Register with Supabase Auth
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  // Insert role and other profile data into the profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: user.id, email, role }]);
  if (profileError)
    return res.status(400).json({ error: profileError.message });

  // Inform the user to verify their email if email verification is enabled
  res.status(200).json({
    message: 'Registration successful. Please check your email for verification.'
  });
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { session, error } = await supabase.auth.signIn({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  // Retrieve the user's role from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (profileError)
    return res.status(400).json({ error: profileError.message });

  res.status(200).json({
    message: 'Login successful',
    token: session.access_token,
    role: profile.role,
  });
});

module.exports = router;

