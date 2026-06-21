// client/src/component/layout/AdminNavbar.jsx

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminNavbar.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

function AdminNavbar({ open, onClose, onMenuClick  }) {

    const { user, logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const firstLetter = user?.fullname?.charAt(0)?.toUpperCase() || "A";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* TOP BAR */}
            <div className="admin-topbar">

            <button
                className="admin-hamburger"
                onClick={onMenuClick}
            >
                ☰
            </button>

            <h3> </h3>

                {/* PROFILE CIRCLE */}
                <div className="profile-wrapper" ref={dropdownRef}>

                    <div
                        className="profile-circle"
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt="profile" />
                        ) : (
                            firstLetter
                        )}
                    </div>

                    {profileOpen && (
                        <div className="profile-dropdown">

                            <Link
                                to="/adminprofile"
                                onClick={() => setProfileOpen(false)}
                            >
                                Profile
                            </Link>

                            <Link
                                to="/settings"
                                onClick={() => setProfileOpen(false)}
                            >
                                Settings
                            </Link>

                            <button
                                onClick={() => {
                                    logout();
                                    setProfileOpen(false);
                                }}
                            >
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>            

            {open && <div className="overlay" onClick={onClose}></div>}
        </>
    );
}

export default AdminNavbar;