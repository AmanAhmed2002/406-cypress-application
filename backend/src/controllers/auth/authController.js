const { signUpUser, loginUser } = require('../../services/auth/authService');

async function register(req, res) {
  try {
    const { email, password, full_name, phone_number, age, username, role } = req.body;
    const result = await signUpUser({ email, password, full_name, phone_number, age, username, role });
    
    if (!result.id) {
      // If email confirmation is enabled and the user is not immediately returned.
      return res.status(200).json({
        message: result.message,
      });
    }
    
    return res.status(200).json({
      message: 'Registration successful. Please check your email for verification.',
      userId: result.id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { token, role } = await loginUser({ email, password });
    return res.status(200).json({
      message: 'Login successful',
      token,
      role,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { register, login };
