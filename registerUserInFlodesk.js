const axios = require('axios'); // Import the axios module

const apiKey = 'fd_key_1600342772d244b08023566ad4e8d570.vztGixoHmcHRIDR2gl9Duk4DzsVPr8mvApiiUTQsKZp5c4w8X8yoF5kdl9saZx8aMjOqzPnwCzGWpcPbMhfufo68Q1V808DZenPJS2HH6RMFxiWUheQNcnNRuyfT3TovdGa00H5QlFtl9B9IGIImNReUB9Q1zhhgg2r5mre258bdEDSbzAeGWTobZa7g0csZ';
const segmentId = '6707ab0ef39ba507b716269b'; // Flodesk Segment ID
const url = 'https://api.flodesk.com/v1/subscribers'; // Flodesk API URL

// Function to register a user in Flodesk using axios
async function registerUserInFlodesk(email, firstName) {
  if (!email || !firstName) {
    throw new Error('Email and First Name are required');
  }

  // Prepare the subscriber data
  const subscriberData = {
    email: email,
    first_name: firstName,
    status: 'active', // Add the user as active
    segments: [{ id: segmentId }] // Add to a specific segment
  };

  try {
    // Make the API call to Flodesk using axios
    const response = await axios.post(url, subscriberData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    // Return the successful response from Flodesk
    return response.data; // Axios response is in the `data` field
  } catch (error) {
    // Return the error if the API request fails
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

module.exports = registerUserInFlodesk;
