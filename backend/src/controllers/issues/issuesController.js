const { submitIssueService } = require('../../services/issues/issuesService');

async function submitIssue(req, res) {
  console.log("Received request body:", req.body); // For debugging
  
  try {
    const { user_id, issue_type, description, image_url, address, latitude, longitude } = req.body;
    
    // Validate required fields
    if (!user_id || !issue_type || !description || !image_url) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    
    const issue = await submitIssueService({ user_id, issue_type, description, image_url, address, latitude, longitude, status: 'submitted' });
    
    console.log("Issue submitted successfully. Issue ID:", issue.id);
    return res.status(200).json({
      message: 'Issue submitted successfully',
      issue_id: issue.id,
    });
  } catch (error) {
    console.error("Error in submitIssue controller:", error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { submitIssue };
