// client/src/service/authService.js

import API_BASE from "../config/api";
console.log("API_BASE IS:", API_BASE);
/**
 * LOGIN USER
 */
export const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    return res.json();
};

/**
 * REGISTER USER
 */
export const registerUser = async (data) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        return { success: false, message: text };
    }
};