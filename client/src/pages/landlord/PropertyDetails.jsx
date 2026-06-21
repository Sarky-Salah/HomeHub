// client/src/pages/landlord/PropertyDetails.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../config/api";
import "../../styles/forms.css"
import "../../styles/property.css"

function PropertyDetails() {

    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const navigate = useNavigate();

    console.log("Property ID:", id);

    useEffect(() => {

        fetch(`${API_BASE}/api/properties/${id}`)
            .then(res => res.json())
            .then(data => {

                if (data.success) {
                    setProperty(data.property);
                }

            })
            .catch(err => console.log(err));
    }, [id]);

    if (!property) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="property-container">

            <form className="form-card">
                
                <h1>{property.property_name}</h1>

                {/* Images */}
                <div>
                    {property.images?.map((img, i) => (
                        <img key={i} src={img} alt="property" />
                    ))}
                </div>

                {/* Videos */}
                <div>
                    {property.videos?.map((video, i) => (
                        <video 
                            key={`vid-${i}`} 
                            src={video} 
                            controls 
                            alt="property video"
                            style={{ maxWidth: '100%', height: 'auto' }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ))}
                </div>

                {property.latitude && property.longitude && (
                    <iframe
                        title="property-map"
                        width="100%"
                        height="300"
                        src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed`}
                    />
                )}
                <br /><br />  

                <label>Owner: {property.landlord_name}</label>
                <label>Contact: {property.contact}</label>
                <label>Price: {property.price}</label>
                <label>Location: {property.location}</label>
                <label>Description: {property.description}</label>
  
            <button type="button" onClick={() => navigate("/properties")}>
                    Back
                </button>
            </form>
        </div>
    );
}

export default PropertyDetails;