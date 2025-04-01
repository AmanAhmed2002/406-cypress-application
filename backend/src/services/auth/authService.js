const { supabase } = require('../../utils/supabaseClient');

async function signUpUser({ email, password, full_name, phone_number, age, username, role }) {
  // Use Supabase Auth to sign up the user.
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  
  // When email confirmation is enabled, data.user may be null.
  if (!data.user) {
    return { id: null, message: 'Registration successful. Please verify your email.' };
  }
  
  const user = data.user;
  
  // Insert profile details into the profiles table.
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: user.id,
      full_name,
      phone_number,
      age,
      username,
      role,
    }]);
  
  if (profileError) {
    throw new Error(profileError.message);
  }
  
  return user;
}

async function loginUser({ email, password }) {
  // Use Supabase's signInWithPassword method for login.
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  
  const session = data.session;
  if (!session || !session.user) {
    throw new Error('No session or user returned.');
  }

  // Retrieve the user's role from the profiles table.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  // If no profile is found, default to 'citizen' for testing.
  const userRole = (profileError || !profile) ? 'citizen' : profile.role;

  return {
    token: session.access_token,
    role: userRole,
  };
}

module.exports = { signUpUser, loginUser };
