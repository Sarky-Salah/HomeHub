// client/src/service/propertyService.js

import API_BASE from "../config/api";

export const createProperty = async (formData) => {
    console.log("API_BASE =", API_BASE);

    const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to create property");
    }
    
    return result;
};

export const getMyProperties = async (page = 1) => {
    const res = await fetch(
        `${API_BASE}/api/properties/my-properties?page=${page}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    return res.json();
};

export const getProperties = async (page = 1) => {
    const res = await fetch(`${API_BASE}/api/properties?page=${page}`);
    return res.json();
};