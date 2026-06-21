// client/src/pages/landlord/AddProperties.jsx

import { MapContainer, TileLayer} from "react-leaflet";
import { createProperty } from "../../services/propertyService";
import { useState } from "react";
import "../../styles/forms.css"
import "leaflet/dist/leaflet.css";
import MapPicker from "../MapPicker";
import { useNavigate } from "react-router-dom";


function AddProperties() {
    const [imagePreview, setImagePreview] = useState([]);
    const [videoPreview, setVideoPreview] = useState([]);
    const [position, setPosition] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        property_name: "",
        landlord_name: user?.fullname || "",
        contact: user?.phoneNumber || "",
        price: "",
        location: "",
        latitude: "",
        longitude: "",
        availability: true,
        description: "",
        category: "Hostel",
        images: [],
        videos: []
    });

    const currencyMap = {
        Uganda: "UGX",
        Kenya: "KES",
        Tanzania: "TZS",
        Rwanda: "RWF",
        "South Sudan": "SSP"
    };
    
    const currency = currencyMap[user?.country] || "UGX";

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
    
        setFormData({
            ...formData,
            [name]: files
        });
    
        if (name === "images") {
            const imageUrls = Array.from(files).map(file =>
                URL.createObjectURL(file)
            );
    
            setImagePreview(imageUrls);
        }
    
        if (name === "videos") {
            const videoUrls = Array.from(files).map(file =>
                URL.createObjectURL(file)
            );
    
            setVideoPreview(videoUrls);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
    
        // text fields
        for (const key in formData) {
            if (key !== "images" && key !== "videos") {
                data.append(key, formData[key]);
            }
        }
    
        // images
        Array.from(formData.images).forEach(file => {
            data.append("images", file);
        });
    
        // videos
        Array.from(formData.videos).forEach(file => {
            data.append("videos", file);
        });
    
        const res = await createProperty(data);
    
        if (res.success) {
    
            setFormData({
                property_name: "",
                landlord_name: user?.fullname || "",
                contact: user?.phoneNumber || "",
                price: "",
                location: "",
                latitude: "",
                longitude: "",
                availability: "Available",
                description: "",
                category: "Hostel",
                images: [],
                videos: []
            });
    
            setImagePreview([]);
            setVideoPreview([]);
            setPosition(null);
            alert("Property created successfully");
            navigate("/Properties");
        } else {
            alert(res.message || "Failed to create property");
        }
    };

    return (
        <div className="property-container">

            <form className="form-card" onSubmit={handleSubmit}>

                <h1>Add A New Property</h1>
                <hr />

                <label>Select Property Photos</label>
                <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="preview-grid">
                    {imagePreview.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Preview ${index}`}
                            className="preview-image"
                        />
                    ))}
                </div>

                <label>Select Property Videos</label>

                <input
                    type="file"
                    name="videos"
                    multiple
                    accept="video/*"
                    onChange={handleFileChange}
                />

                <div className="preview-grid">
                    {videoPreview.map((src, index) => (
                        <video
                            key={index}
                            src={src}
                            controls
                            className="preview-video"
                        />
                    ))}
                </div>

                <input
                    type="text"
                    name="property_name"
                    placeholder="Property Name"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    value={formData.landlord_name}
                    readOnly
                />

                <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    readOnly
                />

                <input
                    type="number"
                    name="price"
                    placeholder={`Price in ${currency} e.g 350,000`}
                    value={formData.price}
                    onChange={handleChange} 
                    min="1"
                    step="1"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                />

                <select
                    name="availability"
                    value={formData.availability}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            availability: e.target.value === "true"
                        })
                    }
                >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>

                <select
                    name="category"
                    onChange={handleChange}
                >
                    <option value="" >Select type Of Property</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Hostel">Hostel</option>
                    <option value="House">House</option>
                    <option value="1 Bedroom">1 Bedroom</option>
                    <option value="2 Bedroom">2 Bedroom</option>
                </select>

                <button
                    type="button"
                    onClick={() => {
                        if (!navigator.geolocation) {
                            alert("Geolocation not supported in this browser");
                            return;
                        }

                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                setFormData(prev => ({
                                    ...prev,
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                }));
                            },
                            (error) => {

                                if (error.code === 1) {
                                    alert("Location permission denied. Please enable location in browser settings.");
                                }

                                if (error.code === 2) {
                                    alert("Location unavailable. Try turning on GPS.");
                                }

                                if (error.code === 3) {
                                    alert("Location request timed out. Try again.");
                                }

                                console.log("Geolocation error:", error);
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 15000,
                                maximumAge: 0
                            }
                        );
                    }}
                >
                    Allow Location Access
                </button>

                <button onClick={() => console.log(navigator.geolocation)}>
                    Test Geolocation
                </button>

                <MapContainer
                    center={[0.3476, 32.5825]}
                    zoom={13}
                    style={{ height: "300px", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapPicker
                        position={position}
                        setCoordinates={(coords) => {

                            setPosition(coords);

                            setFormData(prev => ({
                                ...prev,
                                latitude: coords.lat,
                                longitude: coords.lng
                            }));
                        }}
                    />
                </MapContainer>

                <input
                    type="text"
                    value={formData.latitude}
                    placeholder="Latitude"
                    readOnly
                />

                <input
                    type="text"
                    value={formData.longitude}
                    placeholder="Longitude"
                    readOnly
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                />

                <button type="submit">
                    Create A New Property
                </button>

            </form>

        </div>
    );
}

export default AddProperties;