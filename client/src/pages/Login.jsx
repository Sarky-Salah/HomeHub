// client/src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import API_BASE from "../config/api";
import "../styles/authForm.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = await loginUser(email, password);

        if (data.success) {

            login(data.user, data.token);

            if (data.user.role === "tenant") {
                navigate("/dashboard-tenant");
            }

            if (data.user.role === "landlord") {
                navigate("/dashboard-landlord");
            }

            if (data.user.role === "admin") {
                navigate("/dashboard-admin");
            }

        } else {
            alert(data.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {

        const res = await fetch(`${API_BASE}/api/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: credentialResponse.credential
            })
        });
    
        const data = await res.json();
    
        if (data.success) {
            login(data.user, data.token);
    
            if (data.user.role === "tenant") {
                navigate("/dashboard-tenant");
            }
    
            if (data.user.role === "landlord") {
                navigate("/dashboard-landlord");
            }
    
            if (data.user.role === "admin") {
                navigate("/dashboard-admin");
            }
        } else {
            alert("Google login failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button><br />

                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Google Login Failed")}
                />
                <Link to="/forgotpassword" className="forgot-password-link">
                    Forgot Password?
                </Link>
            </form>
        </div>
    );
}

export default Login;