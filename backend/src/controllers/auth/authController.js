const { signUpUser, loginUser } = require('../../services/auth/authService');

async function register(req, res) {
  try {
    const { email, password, full_name, phone_number, age, username, role } = req.body;
    const result = await signUpUser({ email, password, full_name, phone_number, age, username, role });
    
    if (!result.id) {
      // If email confirmation is enabled and the user is not immediately returned.
      console.log("Registration: Email confirmation required. No immediate user returned.");
      return res.status(200).json({
        message: result.message,
      });
    }
    
    console.log("Registration successful. User ID:", result.id);
    return res.status(200).json({
      message: 'Registration successful. Please check your email for verification.',
      userId: result.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    
    // Debug: Log the returned login details
    console.log("Login successful. Returned data:", result);
    
    return res.status(200).json({
      message: 'Login successful',
      token: result.token,
      role: result.role,
      user_id: result.user_id,  // Return user_id so the frontend can store it
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { register, login };
