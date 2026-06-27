// client/src/pages/landlord/PropertyDetails.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_BASE from "../../config/api";
import "../../styles/forms.css"
import "../../styles/property.css"

function PropertyDetails() {

    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(0);
    const { user } = useAuth();
    const userId = user?._id;
    const ownerId = property?.owner?._id || property?.owner;
    const isOwner = userId && ownerId && String(userId) === String(ownerId);
    const canMessage = user && property && !isOwner;
    
    const handleBack = () => {
        if (user?.role === "landlord") {
            navigate("/dashboard-landlord");
        } else if (user?.role === "tenant") {
            navigate("/dashboard-tenant");
        } else {
            navigate("/");
        }
    };
    
    const nextImage = () => {

        if (!property?.images?.length) return;
    
        setCurrentImage(prev =>
            prev === property.images.length - 1
                ? 0
                : prev + 1
        );
    };
    const nextVideo = () => {

        if (!property?.videos?.length) return;
    
        setCurrentVideo(prev =>
            prev === property.videos.length - 1
                ? 0
                : prev + 1
        );
    };

    const prevImage = () => {
    
        if (!property?.images?.length) return;
    
        setCurrentImage(prev =>
            prev === 0
                ? property.images.length - 1
                : prev - 1
        );
    };
    const prevVideo = () => {
    
        if (!property?.videos?.length) return;
    
        setCurrentVideo(prev =>
            prev === 0
                ? property.videos.length - 1
                : prev - 1
        );
    };

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
    console.log("Images:", property.images);
    console.log("Image count:", property.images?.length);
    return (
        <div className="property-container">

            <form className="form-card">
                
                <h1>{property.property_name}</h1>

                {/* Images */}
                <div className="property-gallery">
                    <div className="image-gallery">

                        <img
                            src={property.images[currentImage]}
                            alt="Property"
                            className="gallery-image"
                        />

                        {property.images.length > 1 && (
                            <>
                                <button
                                    className="gallery-btn prev"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        prevImage();
                                    }}
                                >
                                    ❮
                                </button>

                                <button
                                    className="gallery-btn next"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        nextImage();
                                    }}
                                >
                                    ❯
                                </button>
                            </>
                        )}

                    </div>
                </div>

                {/* Videos */}
                <div className="property-gallery">
                    <div className="image-gallery">

                        <video
                            src={property.videos[currentVideo]}
                            controls
                            className="gallery-image"
                        >
                            Your browser does not support the video tag.
                        </video>

                        {property.videos.length > 1 && (
                            <>
                                <button
                                    className="gallery-btn prev"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        prevVideo();
                                    }}
                                >
                                    ❮
                                </button>

                                <button
                                    className="gallery-btn next"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        nextVideo();
                                    }}
                                >
                                    ❯
                                </button>
                            </>
                        )}

                    </div>
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
                {canMessage && (
                    <button
                        type="button"
                        className="edit"
                        onClick={async () => {
                            const res = await fetch(
                                `${API_BASE}/api/messages/start`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("token")}`
                                    },
                                    body: JSON.stringify({
                                        receiverId: ownerId
                                    })
                                }
                            );

                            const data = await res.json();
                            console.log("Conversation:", data.conversation);
                            if (data.success) {
                                navigate(`/messages/${data.conversation._id}`);
                            }
                        }}
                    >
                        Message Owner
                    </button>
                )}
                {user?.role === "landlord" &&
                property.landlord === user._id && (
                    <button
                        className="edit"
                        onClick={() =>
                            navigate(`/edit-property/${property._id}`)
                        }
                    >
                        Edit Property
                    </button>
                )}

                <button className="back" onClick={handleBack}>
                    Back
                </button>
            </form>
        </div>
    );}

export default PropertyDetails;