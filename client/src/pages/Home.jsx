import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../context/AuthContext";
import "../styles/property.css"
import API_BASE from "../config/api";

function Home() {
    const [properties, setProperties] = useState([]);
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const isLoggedIn = !!user;

    useEffect(() => {
        fetch(`${API_BASE}/api/properties`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
    
                    if (page === 1) {
                        setProperties(data.properties);
                    } else {
                        setProperties(prev => [...prev, ...data.properties]);
                    }
    
                    setHasMore(page < data.totalPages);
                }
            });
    }, [page]);

    return (
        <div>
            <div className="properties-container">
                <h1>HomeHub</h1>
            </div>
            <div className="properties-container">            
                <h1>Available Properties</h1>
                <div className="properties-list">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property._id}
                            property={property}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}    
                </div>
                {hasMore && (
                    <button onClick={() => setPage(prev => prev + 1)}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;