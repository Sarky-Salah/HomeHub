// client/src/pages/admin/Property.jsx

import { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import AdminTable from "../../components/admin/AdminTable";

import "../../styles/property.css"

function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProperty, setEditingProperty] = useState(null);

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
    // DELETE
    const handleDelete = async (id) => {
        const confirm = window.confirm("Delete this property?");
        if (!confirm) return;

        const res = await fetch(`${API_BASE}/api/admin/properties/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();

        if (data.success) {
            setProperties(prev => prev.filter(p => p._id !== id));
        }
    };

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

    const columns = [
        { key: "property_name", label: "Title" },
        { key: "landlord_name", label: "Landlord" },
        { key: "contact", label: "Contact" },
        { key: "location", label: "Location" },
        { key: "price", label: "Price" },
        { key: "category", label: "Category" },
        { key: "description", label: "Description" },
        {
            key: "availability",
            label: "Status",
            render: (value) => (
                <span
                    style={{
                        color: value ? "#28a745" : "#dc3545",
                        fontWeight: "bold"
                    }}
                >
                    {value ? "Available" : "Unavailable"}
                </span>
            )
        }
    ];
    console.log(properties);
    return (
        <div>
            <h1>Properties</h1>
            <hr /><hr />
            
            <AdminTable
                columns={columns}
                data={properties}
                actions={(p) => (
                    <>
                        <button
                            className="approve-btn"
                            onClick={() => setEditingProperty(p)}
                        >
                            Edit
                        </button>

                        <button
                            className="reject-btn"
                            onClick={() => handleDelete(p._id)}
                        >
                            Delete
                        </button>
                    </>
                )}
            />

            {/* EDIT MODAL */}
            {editingProperty && (
                <div className="admin-edit">
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
                            value={editingProperty.landlord_name}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    landlord_name: e.target.value
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

                        <input
                            value={editingProperty.category}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    category: e.target.value
                                })
                            }
                        />

                        <input
                            value={editingProperty.description}
                            onChange={(e) =>
                                setEditingProperty({
                                    ...editingProperty,
                                    description: e.target.value
                                })
                            }
                        />
                        <div style={{display:"inline"}}>
                            <input
                                type="checkbox"
                                checked={editingProperty.availability}
                                onChange={(e) =>
                                    setEditingProperty({
                                        ...editingProperty,
                                        availability: e.target.checked
                                    })
                                }
                            />

                            <span>Available</span>
                        </div>

                        <hr />

                        <button className="approve-btn" onClick={handleSave}>Save</button>
                        <button className="reject-btn" onClick={() => setEditingProperty(null)}>
                            Cancel
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Properties;