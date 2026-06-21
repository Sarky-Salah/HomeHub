// client/src/pages/tenant/Properties.jsx

import { useEffect, useState } from "react";
import PropertyCard from "../../components/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import API_BASE from "../../config/api";

function Properties() {
    const [properties, setProperties] = useState([]);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE}/api/properties`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProperties(data.properties);
                }
            });
    }, []);

    return (
        <div className="properties-container">
            <h1>Available Properties</h1>

            {properties.map((property) => (
                <div key={property._id} className="property-card">

                    <h2>{property.property_name}</h2>
                    <p><b>Owner:</b> {property.landlord_name}</p>

                    {isLoggedIn && (
                        <p><b>Contact:</b> {property.contact}</p>
                    )}

                    <p><b>Price:</b> {property.price}</p>
                    <p><b>Location:</b> {property.location}</p>

                    <p><b>Description:</b> {property.description}</p>

                    {/* Images */}
                    <div className="images">
                        {property.images?.map((img, i) => (
                            <img key={i} src={img} alt="property" />
                        ))}
                    </div>

                    {/* Videos */}
                    <div className="videos">
                        {property.videos?.map((vid, i) => (
                            <video key={i} src={vid} controls />
                        ))}
                    </div>

                    {/* Map (for logged-in users) */}
                    {isLoggedIn && property.latitude && property.longitude && (
                        <iframe
                            title={`map-${property._id}`}
                            width="100%"
                            height="250"
                            src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed`}
                        />
                    )}

                </div>
            ))}
        </div>
    );

}

export default Properties;