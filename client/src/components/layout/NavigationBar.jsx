import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/homehub-logo.jpg";
import { useAuth } from "../../context/AuthContext";

function NavigationBar() {
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar">

            {/* LOGO */}
            <Link className="logo">
                <img src={logo} alt="HomeHub Logo" />
            </Link>

            {/* HAMBURGER */}
            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>

            {/* MENU */}
            <div
                ref={menuRef}
                className={`nav-links ${menuOpen ? "active" : ""}`}
            >
                {!user && (
                    <>
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                        <Link to="/register" onClick={closeMenu}>Register</Link>
                    </>
                )}

                {user?.role === "tenant" && (
                    <>
                        <Link to="/dashboard-tenant" onClick={closeMenu}>Dashboard</Link>
                        <Link to="/my-messages" onClick={closeMenu}>My Messages</Link>
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <button onClick={() => { logout(); closeMenu(); }}>
                            Logout
                        </button>
                    </>
                )}

                {user?.role === "landlord" && (
                    <>
                        <Link to="/dashboard-landlord" onClick={closeMenu}>Dashboard</Link>
                        <Link to="/add-property" onClick={closeMenu}>Add Property</Link>
                        <Link to="/my-properties" onClick={closeMenu}>My Properties</Link>
                        <Link to="/my-messages" onClick={closeMenu}>My Messages</Link>
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <button onClick={() => { logout(); closeMenu(); }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavigationBar;