// client/src/config/api.js
// Central API configuration for HomeHub

// change this IP to your PC IP for phone testing
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

if (!API_BASE) {
    console.warn("REACT_APP_API_BASE is not set!");
}

export default API_BASE;