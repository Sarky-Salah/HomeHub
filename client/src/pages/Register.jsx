// client/src/pages/register.jsx
import { useState } from "react";
import { registerUser } from "../services/authService";
function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        phoneNumber: "",
        role: "",
        country: "",
        email: "",
        password: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!formData.role) {
            alert("Please select a role");
            return;
        }

        const data = await registerUser(formData);
    
        if (data.success) {
            alert("Account created successfully");
            window.location.href = "/login";
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                />

                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />

                {/* roles includes tenant, landlord, admin */}
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="">Select Role</option>
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                    {/* <option value="admin">Admin</option> */}
                </select>

                {/* COUNTRY SELECT */}
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                >
                    <option value="">Select Country</option>
                    <option value="Uganda">Uganda</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Tanzania">Tanzania</option>
                </select>

                <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button type="submit">
                    Create Account
                </button>

            </form>
        </div>
    );
}

export default Register;