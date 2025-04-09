const { supabase } = require('../../utils/supabaseClient');

async function submitIssueService({ user_id, issue_type, description, image_url, address, latitude, longitude, status = 'submitted' }) {
  // Log the payload we're about to insert
  console.log("Attempting to insert issue with payload:", {
    user_id,
    issue_type,
    description,
    image_url,
    address,
    latitude,
    longitude,
    status,
  });
  
  const { data, error } = await supabase
    .from('issues')
    .insert([{ user_id, issue_type, description, image_url, address, latitude, longitude, status }])
    .select();
    
  if (error) {
    console.error("Error inserting issue:", error);
    throw new Error(error.message);
  }
  
  console.log("Insert successful, returned data:", data);
  return data[0];
}

module.exports = { submitIssueService };
