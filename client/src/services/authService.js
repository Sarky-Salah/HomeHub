import API_BASE from "../config/api";

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

    return res.json();
};