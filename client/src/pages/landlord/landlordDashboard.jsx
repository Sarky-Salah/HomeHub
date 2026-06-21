// client/src/pages/lanlord/landlordDashboard.jsx

import { useEffect, useState } from "react";
import PropertyCard from "../../components/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import { getProperties } from "../../services/propertyService";
import "../../styles/property.css"

function LandlordDashboard() {
    const [properties, setProperties] = useState([]);
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const isLoggedIn = !!user;

    useEffect(() => {
        getProperties(page)
            .then(data => {
                if (data.success) {
    
                    if (page === 1) {
                        setProperties(data.properties);
                    } else {
                        setProperties(prev => [...prev, ...data.properties]);
                    }
    
                    setHasMore(page < data.totalPages);
                }
            })
            .catch(err => console.log(err));
    }, [page]);

    return (
        <div>
        <h1>
            {user?.role === "admin" ? "All Properties" : "Dashboard Properties"}
        </h1>
            <div className="properties-container">
                <div className="properties-list">
                    {properties
                        .filter((property) => property.availability)
                        .map((property) => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                                isLoggedIn={isLoggedIn}
                            />
                        ))}
                </div>
                {hasMore && (
                    <button type="button" onClick={() => setPage(prev => prev + 1)}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
}

export default LandlordDashboard;