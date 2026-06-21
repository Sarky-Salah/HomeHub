// client/src/config/api.js
// Central API configuration for HomeHub

const isLocal = window.location.hostname === "localhost";

// change this IP to your PC IP for phone testing
const LOCAL_IP = "192.168.100.5:5000";
const API_BASE = "http://192.168.100.5:5000";

export const API_URL = isLocal
    ? "http://localhost:5000"
    : `http://${LOCAL_IP}`;

export default API_BASE;