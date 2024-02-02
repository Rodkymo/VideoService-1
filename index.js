const axios = require('axios');
require('dotenv').config();


async function fetchYouTubeVideosByLocation(latitude, longitude, radius, apiKey) {
    try {
        const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
        const params = {
            part: 'snippet',
            type: 'video',
            location: `${latitude},${longitude}`, // Latitude and longitude separated by comma
            locationRadius: `${radius}km`, // Radius in kilometers
            key: apiKey,
        };

        const response = await axios.get(apiUrl, { params });

        if (response.status === 200) {
            const videos = response.data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                publishedAt: item.snippet.publishedAt,
                link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                timestamp: item.snippet.publishedAt, // Assuming you want to use the publishedAt as the timestamp
                thumbnails: item.snippet.thumbnails // This includes thumbnails of different sizes
            }));
            return videos;
        } else {
            console.error(`Error searching YouTube videos by location: ${response.statusText}`);
            return [];
        }
    } catch (error) {
        console.error('An error occurred while searching YouTube videos by location:', error.message);
        return [];
    }
}

// Example usage:
const latitude = -1.2886; 
const longitude = 36.8233; // Longitude of the location (e.g., Silicon Valley)
const radius = 500; // Radius in kilometers
const apiKey = process.env.API_KEY;

fetchYouTubeVideosByLocation(latitude, longitude, radius, apiKey)
    .then(videos => {
        if (videos.length > 0) {
            console.log(JSON.stringify(videos, null, 2)); // Log videos in JSON format
        } else {
            console.log('No videos found for the specified location.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
