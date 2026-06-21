import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // load from localStorage on refresh
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    // LOGIN
    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        setUser(userData);
        setToken(token);

        navigate("/Properties");
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoggedIn: !!token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook
export const useAuth = () => useContext(AuthContext);