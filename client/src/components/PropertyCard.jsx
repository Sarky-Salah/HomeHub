import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaShare } from "../icons/index";
import API_BASE from "../config/api";

function PropertyCard({ property, isLoggedIn }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [isFavorited, setIsFavorited] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const handleClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        navigate(`/property/${property._id}`);
    };

    // FAVORITE
    const handleFavorite = async (e) => {
        e.stopPropagation();

        try {
            const res = await fetch(
                `${API_BASE}/favorites/${property._id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await res.json();

            if (data.success) {
                setIsFavorited(data.isFavorited);
            }

        } catch (err) {
            console.error(err);
        }
    };

    // SHARE
    const handleShare = async (e) => {
        e.stopPropagation();

        const url = `${window.location.origin}/property/${property._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: property.property_name,
                    text: "Check out this property",
                    url
                });
            } else {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // OPEN REPORT MODAL
    const openReport = (e) => {
        e.stopPropagation();
        setShowReportModal(true);
    };

    // SUBMIT REPORT
    const submitReport = async () => {
        try {
            const res = await fetch(`${API_BASE}/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    propertyId: property._id,
                    reason: reportReason
                })
            });

            const data = await res.json();

            if (data.success) {
                alert("Report submitted");
                setShowReportModal(false);
                setReportReason("");
            }

        } catch (err) {
            console.error(err);
        }
    };

    // CHECK FAVORITE STATUS
    useEffect(() => {
        const checkFavorite = async () => {

            try {
                const res = await fetch(
                    `${API_BASE}/favorites/check/${property._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setIsFavorited(data.isFavorited);
                }

            } catch (err) {
                console.error(err);
            }
        };

        checkFavorite();
    }, [property._id]);

    return (
        <div className="property-card" onClick={handleClick}>

            {/* IMAGE */}
            <div className="property-image-preview">
                {property.images?.length > 0 && (
                    <div className="image-wrapper">

                        <img
                            src={property.images[0]}
                            alt="property"
                            className="property-image"
                        />

                        {property.owner.verificationStatus === "verified" && (
                            <span className="verified-badge">
                                ✓ Verified
                            </span>
                        )}

                    </div>
                )}
            </div>

            <h2>{property.property_name}</h2>
            <p><b>Landlord:</b> {property.owner.fullname}</p>
            <p><b>Location:</b> {property.location}</p>
            <p><b>Description:</b> {property.description}</p>
            <p><b>Price:</b> {property.price} SSP /month</p>

            <hr />

            {/* ACTION BUTTONS */}
            <div className="property-actions">

                <button onClick={handleFavorite}>
                    {isFavorited ? "❤️" : "🤍"}
                </button>

                <button onClick={openReport}>
                    🚩
                </button>

                <button onClick={handleShare}>
                    <FaShare />
                </button>

            </div>

            {/* REPORT MODAL */}
            {showReportModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowReportModal(false)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h3>Report Property</h3>

                        <select
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        >
                            <option value="">Select reason</option>
                            <option value="Spam">Spam</option>
                            <option value="Scam">Scam</option>
                            <option value="Fake Listing">Fake Listing</option>
                            <option value="Offensive Content">Offensive Content</option>
                            <option value="Wrong Information">Wrong Information</option>
                            <option value="Already Sold/Rented">Already Sold/Rented</option>
                            <option value="Other">Other</option>
                        </select>

                        <div className="modal-actions">
                            <button
                                onClick={submitReport}
                                disabled={!reportReason}
                            >
                                Submit
                            </button>

                            <button
                                onClick={() => setShowReportModal(false)}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default PropertyCard;