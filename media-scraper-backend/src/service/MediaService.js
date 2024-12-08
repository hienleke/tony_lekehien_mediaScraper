const axios = require('axios');

async function checkMediaSrc(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Extract Content-Type from headers
    const contentType = response.headers['content-type'];

    // Check if the Content-Type is either image or video
    if (contentType.startsWith('image/')) {
      console.log(`Valid image URL: ${url}`);
      return { valid: true, type: 'image' };
    } else if (contentType.startsWith('video/')) {
      console.log(`Valid video URL: ${url}`);
      return { valid: true, type: 'video' };
    } else {
      console.log(`URL is neither image nor video: ${url}`);
      return { valid: false, type: 'unknown' };
    }
  } catch (error) {
    console.log(`Failed to fetch media: ${url}, Error: ${error.message}`);
    return { valid: false, error: error.message };
  }
}

module.exports = { checkMediaSrc };
