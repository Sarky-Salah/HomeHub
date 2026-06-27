// client/src/pages/admin/Property.jsx

import { useEffect, useState } from "react";
import API_BASE from "../../config/api";

import PropertyCard from "../../components/PropertyCard";
import "../../styles/property.css"

function PropertyDashboard() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProperty, setEditingProperty] = useState(null);

    const [ setPage] = useState(1);
    const [hasMore] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/properties`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setProperties(data.properties);
            }
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <h3>Loading properties...</h3>;
    }

    // UPDATE SAVE
    const handleSave = async () => {
        const res = await fetch(
            `${API_BASE}/api/admin/properties/${editingProperty._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(editingProperty)
            }
        );

        const data = await res.json();

        if (data.success) {
            setProperties(prev =>
                prev.map(p =>
                    p._id === editingProperty._id ? data.property : p
                )
            );
            setEditingProperty(null);
        }
    };

    if (loading) return <h3>Loading properties...</h3>;

    return (
        <div>

            <div>
                <h1>Property's Dashboard</h1>
                <hr /><hr />
                
                <div className="properties-container">
                    <div className="properties-list">
                        {properties
                            .filter((property) => property.availability)
                            .map((property) => (
                                <PropertyCard
                                    key={property._id}
                                    property={property}
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

            {/* EDIT MODAL */}
            {editingProperty && (
                <div className="modal">
                    <div className="modal-content">

                        <h2>Edit Property</h2>

                        <input
                            value={editingProperty.property_name}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    property_name: e.target.value
                                })
                            }
                        />
                        <input
                            value={editingProperty.fullname}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    fullname: e.target.value
                                })
                            }
                        />

                        <input
                            value={editingProperty.contact}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    contact: e.target.value
                                })
                            }
                        />

                        <input
                            value={editingProperty.location}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    location: e.target.value
                                })
                            }
                        />

                        <input
                            value={editingProperty.price}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    price: e.target.value
                                })
                            }
                        />

                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setEditingProperty(null)}>
                            Cancel
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyDashboard;