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

  // check if an issue has already been submitted with matching issue type and location
  const { data: existingIssue, error: checkError} = await supabase
    .from('issues')
    .select('issue_type', 'address', 'latitude', 'longitude')
    .eq('issue_type', issue_type)
    .eq('address', address)
    .eq('latitude', latitude)
    .eq('longitude', longitude)
    .single();

  if (checkError) {
    console.error("error checking for exiting issue:", checkError)
    throw new Error(checkError.message);
  }

  // if attempting to submit a duplicate issue
  if (existingIssue) {
    console.log("issue has already been reported")
    return {message: "Issue has already been reported"}
  }
  
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
