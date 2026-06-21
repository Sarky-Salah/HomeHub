// client/src/pages/landlord/MyProperties.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PropertyCard from "../../components/PropertyCard";
import API_BASE from "../../config/api"
import { getMyProperties  } from "../../services/propertyService";
import "../../styles/property.css"

function MyProperties() {

    const [properties, setProperties] = useState([]);
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
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
    const approveUser = async (userId) => {
        console.log(userId);
    };
    
    const rejectUser = async (userId) => {
        console.log(userId);
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
    useEffect(() => {
        getMyProperties(page)
            .then(data => {
                if (data.success) {
    
                    if (page === 1) {
                        setProperties(data.properties);
                    } else {
                        setProperties(prev => [
                            ...prev,
                            ...data.properties
                        ]);
                    }
    
                    setHasMore(page < data.totalPages);
                }
            })
            .catch(err => console.log(err));
    }, [page]);
    console.log("Properties State:", properties);
    return (
        <div>
            <h1>
                {user?.role === "admin" ? "All Properties" : "My Properties"}
            </h1>
            <div className="properties-container">
                {user?.role === "landlord" && (
                    <button type="button" onClick={requestVerification}>
                        Request Verification
                    </button>
                )}
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
                            <span>
                                {p.availability ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    ))}

                </div>
                <button type="load-properties"
                    disabled={!hasMore}
                    onClick={() => setPage(prev => prev + 1)}
                >
                    Load More
                </button>
                {hasMore && (
                    <button onClick={() => setPage(prev => prev + 1)}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
}

export default MyProperties;