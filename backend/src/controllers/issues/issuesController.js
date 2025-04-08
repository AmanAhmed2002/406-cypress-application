const { submitIssueService } = require('../../services/issues/issuesService');
const { supabase } = require('../../utils/supabaseClient');

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

// New function: GET /issues/mine - Retrieves issues submitted by the logged-in user (Citizen view)
async function getMyReports(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.json({ message: 'No reports found' });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// New function: PUT /issues/:id - Allows city staff to update an issue (status, feedback, assigned_staff)
async function updateIssue(req, res) {
  const issueId = req.params.id;
  const { status, feedback, assigned_staff } = req.body;
  try {
    const { data, error } = await supabase
      .from('issues')
      .update({ status, feedback, assigned_staff })
      .eq('id', issueId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// New function: GET /issues - City staff dashboard to view/filter issues (by department and/or status)
async function getIssues(req, res) {
  const { department, status } = req.query;
  let query = supabase.from('issues').select('*');

  if (department) {
    query = query.eq('department', department);
  }
  if (status) {
    query = query.eq('status', status);
  }
  try {
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  submitIssue,
  getMyReports,
  updateIssue,
  getIssues
};

