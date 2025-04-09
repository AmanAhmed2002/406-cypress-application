const { supabase } = require('../../utils/supabaseClient');

// Haversine formula to calculate the distance between two lat/lng points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const φ1 = lat1 * (Math.PI / 180); // Convert latitude to radians
  const φ2 = lat2 * (Math.PI / 180); // Convert latitude to radians
  const Δφ = (lat2 - lat1) * (Math.PI / 180); // Difference in latitude
  const Δλ = (lon2 - lon1) * (Math.PI / 180); // Difference in longitude

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // Return distance in meters
}

const ACCEPTABLE_RADIUS = 15; // acceptable distance to assume same location

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
    .eq('address', address);

  if (checkError) {
    console.error("error checking for exiting issue:", checkError)
    throw new Error(checkError.message);
  }

  
  // if attempting to submit a duplicate issue + check if latitude and longitude are close enough to count as a duplicate issue
  if (existingIssue) {
    const distance = haversine(latitude, longitude, existingIssue.latitude, existingIssue.longitude); 
    console.log(`Distance to existing issue: ${distance} meters`);
    if (distance <= ACCEPTABLE_RADIUS) {
       console.log("issue has already been reported");
      return {message: "Issue has already been reported"};
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
