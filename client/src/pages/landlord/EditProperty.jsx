// client/src/pages/landlord/EditProperty.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import "../../styles/property.css"
import "../../styles/Admin.css"
import "../../styles/forms.css"

function EditProperty() {

    const { id } = useParams();

    const [ setEditing] = useState(false);

    const [formData, setFormData] = useState({
        property_name: "",
        contact: "",
        location: "",
        price: "",
        description: ""
    });

    useEffect(() => {
        fetch(`${API_BASE}/api/properties/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setFormData(data.property);
                }
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(
            `${API_BASE}/api/properties/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${
                        localStorage.getItem("token")
                    }`
                },
                body: JSON.stringify(formData)
            }
        );

        const data = await res.json();

        try{
            if (data.success) {
                alert("Property updated successfully");
                setEditing(false);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Failed to update Property");
        }
    };

    return (
        <div className="property-container">            
            <form className="form-card" onSubmit={handleSubmit}>

                <h1>Edit Property</h1>
                <label htmlFor="">Property's Name</label>
                <input
                    value={formData.property_name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            property_name: e.target.value
                        })
                    }
                />

                <label htmlFor="">Price Per month</label>
                <input
                    value={formData.price}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            price: e.target.value
                        })
                    }
                />

                <label htmlFor="">Location</label>
                <input
                    value={formData.location}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            location: e.target.value
                        })
                    }
                />

                <label htmlFor="">Description</label>
                <input
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value
                        })
                    }
                />

                <button className="approve-btn" type="submit">
                    Save Changes
                </button>

                <button className="reject-btn"
                    type="submit"
                    onClick={() => setEditing(false)}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditProperty;