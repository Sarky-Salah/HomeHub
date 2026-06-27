import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";
import "../styles/forms.css";

function AdminProfile(){
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        country: user?.country || ""
    });

    const [editing, setEditing] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {

        try {

            const res = await fetch(
                `${API_BASE}/api/users/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Profile updated successfully");
                setEditing(false);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Failed to update profile");
        }
    };
    
    return (
        <div className="property-container">
            <h1>Admin's Profile</h1>
        

        <div className="form-card">

            <h1>My Profile</h1>

            <div
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "#1e1e1e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    margin: "0 auto 20px"
                }}
            >
                {user?.fullname?.charAt(0).toUpperCase()}
            </div>

            <label>Full Name</label>
            <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                disabled={!editing}
            />

            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
            />

            <label>Phone Number</label>
            <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!editing}
            />

            <label>Country</label>
            <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!editing}
            />

            {!editing ? (
                <button
                    onClick={() => setEditing(true)}
                >
                    ✏️ Edit Profile
                </button>
            ) : (
                <>
                    <button
                        onClick={handleUpdate}
                    >
                        💾 Save Changes
                    </button>

                    <button
                        onClick={() => setEditing(false)}
                        style={{
                            background: "#888",
                            marginTop: "10px"
                        }}
                    >
                        Cancel
                    </button>
                </>
            )}

        </div>

        </div>
    );
}

export default AdminProfile;