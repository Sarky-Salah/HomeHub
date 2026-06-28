// client/src/pages/landlord/MyProperties.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PropertyCard from "../../components/PropertyCard";
import API_BASE from "../../config/api"

import "../../styles/property.css"
import "../../styles/Admin.css"

function MyProperties() {

    const [properties, setProperties] = useState([]);
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);    
    const [loading, setLoading] = useState(false);

    const requestVerification = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/api/users/request-verification`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
    
            const data = await res.json();
            console.log("REQUEST RESPONSE:", data);
        } catch (err) {
            console.log(err);
        }
    };
    
    const toggleAvailability = async (id, currentAvailability) => {
        console.log("Toggling:", id, currentAvailability);
    
        try {
            const res = await fetch(
                `${API_BASE}/api/properties/${id}/availability`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        availability: !currentAvailability
                    })
                }
            );
    
            const data = await res.json();
    
            console.log("SERVER RESPONSE:", data);
    
            if (data.success) {
                setProperties(prev =>
                    prev.map(property =>
                        property._id === id
                            ? {
                                  ...property,
                                  availability: !currentAvailability
                              }
                            : property
                    )
                );
            }
        } catch (err) {
            console.log("TOGGLE ERROR:", err);
        }
    };    

    const loadProperties = async (newPage = 1, reset = false) => {

        setLoading(true);
    
        try {
    
            const res = await fetch(
                `${API_BASE}/api/properties/my?page=${newPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
    
            const data = await res.json();
    
            if (data.success) {
    
                if (reset || newPage === 1) {
                    setProperties(data.properties);
                } else {
                    setProperties(prev => [
                        ...prev,
                        ...data.properties
                    ]);
                }
    
                setHasMore(newPage < data.totalPages);
            }
    
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        loadProperties(page, page === 1);

        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 200 &&
                hasMore &&
                !loading
            ) {
                setPage(prev => prev + 1);
            }
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () =>
            window.removeEventListener("scroll", handleScroll);
    
    }, [hasMore, loading, page]);

    console.log("Properties State:", properties);
    return (
        <div>
            <h1>
                My Properties
            </h1>
            <div className="horizontal">
                <button>Add A New Property</button>
                <div className="properties-container">
                    {user?.role === "landlord" &&
                    user?.verificationStatus === "unverified" && (
                        <button
                            type="button"
                            onClick={requestVerification}
                        >
                            Request Verification
                        </button>
                    )}
                    {user?.verificationStatus === "pending" && (
                        <p style={{ color: "orange" }}>
                            Verification Request Pending
                        </p>
                    )}
                    
                    {user?.verificationStatus === "verified" && (
                        <p style={{ color: "green" }}>
                            ✓ Verified Landlord
                        </p>
                    )}
                    
                    {user?.verificationStatus === "rejected" && (
                        <p style={{ color: "red" }}>
                            Verification Request Rejected
                        </p>
                    )}
                </div>
            </div>
            <div className="properties-list">
                {properties.map(p => (
                        <div key={p._id}>

                            <PropertyCard
                                property={p}
                                isLoggedIn={!!user}
                            />
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={p.availability}
                                    onChange={() =>{
                                        console.log("TOGGLE CLICKED:", p._id, p.availability);
                                        toggleAvailability(p._id, p.availability)
                                    }}
                                />
                                <span className="slider"></span>
                            </label>
                            <span
                                style={{
                                    color: p.availability ? "#28a745" : "#dc3545",
                                    fontWeight: "bold"
                                }}>
                                {p.availability ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    ))}
            </div>
    
            {loading && (
                    <div className="loading-more">
                        Loading more properties...
                    </div>
                )}
                {!hasMore && properties.length > 0 && (
                    <div className="end-properties">
                        No more properties.
                    </div>
                )}
        </div>
    );
}

export default MyProperties;