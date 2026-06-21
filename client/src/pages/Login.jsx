import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
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

                <a rel="stylesheet" href="Forgot Password?">Forgot Password?</a>
            </form>
        </div>
    );
}

export default Login;