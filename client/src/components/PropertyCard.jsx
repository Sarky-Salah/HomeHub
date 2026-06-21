// cleint/src/components/PropertyCard.jsx

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function PropertyCard({ property, isLoggedIn }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleClick = () => {

        console.log("CARD CLICKED", property._id);
        if (!user) {
            navigate("/login");
            return;
        }

        navigate(`/property/${property._id}`);
    };

    return (
        <div className="property-card" onClick={handleClick}>
            <h3>
                {property.owner.fullname}

                {property.owner.verificationStatus === "verified" && (
                    <span className="verified-badge">
                        ✓ Verified
                    </span>
                )}
            </h3>

            {/* Images */}
            <div>
                {property.images?.map((img, i) => (
                    <img key={i} src={img} alt="property" />
                ))}
            </div>

            <h2>{property.property_name}</h2>

            <p><b>Location:</b> {property.location}</p>
            <p><b>Description:</b> {property.description}</p>
            <p><b>Price:</b> {property.price} /month</p>
            
            <hr />
            {/* ACTION BUTTONS */}
            <div className="property-actions">                               

                {/* Favorite */}
                <button
                    onClick={() => console.log("favorite", property._id)}
                    title="Favorite"
                >
                    ❤️
                </button>

                {/* Report */}
                <button onClick={() => console.log("report", property._id)}
                    title="Report"
                >
                    🚩
                </button>

                {/* Share */}
                <button onClick={() => navigator.share
                    ? navigator.share({
                        title: property.property_name,
                        url: `${window.location.origin}/property/${property._id}`
                    })
                    : navigator.clipboard.writeText(
                        `${window.location.origin}/property/${property._id}`
                    )
                }
                title="Share"
                >
                    🔗
                </button>{/* View */}

            </div>
        </div>
    );
}

export default PropertyCard;