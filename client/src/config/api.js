// client/src/config/api.js
// Central API configuration for HomeHub

// change this IP to your PC IP for phone testing
const API_BASE = "https://homehub-qgeg.onrender.com";

if (!API_BASE) {
    console.warn("REACT_APP_API_BASE is not set!");
}

export default API_BASE;