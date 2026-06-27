// client/src/pages/admin/admindashboard.jsx

import { useEffect, useState } from "react";
import API_BASE from "../../config/api";

function AdminDashboards() {
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUsers(data.users);
            }
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/online-count`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOnlineUsers(data.onlineUsers);
                }
            });
    }, []);

    const totalUsers = users.length;

    const landlords = users.filter(u => u.role === "landlord").length;
    const tenants = users.filter(u => u.role === "tenant").length;
    const admin = users.filter(u => u.role === "admin").length;

    const usersByCountry = users.reduce((acc, user) => {
        const country = user.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    const [properties, setProperties] = useState([]);

    const totalProperties = properties.length;


    const available = properties.filter(p => p.availability).length;
    const unavailable = properties.filter(p => !p.availability).length;    

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
        });
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <hr /><hr />

            <div className="stat-card">
                <h3>Online Users</h3>
                <p>{onlineUsers}</p>
            </div>
    
            <h1>User Stats</h1>
            <hr />
            {/* STATS CARDS */}
            <div className="stats-container">
    
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{totalUsers}</p>
                </div>
    
                <div className="stat-card">
                    <h3>Landlords</h3>
                    <p>{landlords}</p>
                </div>
    
                <div className="stat-card">
                    <h3>Tenants</h3>
                    <p>{tenants}</p>
                </div>

                <div className="stat-card">
                    <h3>Admin</h3>
                    <p>{admin}</p>
                </div>
    
            </div>
    
            {/* COUNTRY STATS */}
            <div className="country-stats">
                <h3>Users by Country</h3>
    
                {Object.entries(usersByCountry).map(([country, count]) => (
                    <div key={country} className="country-row">
                        <span>{country}</span> &nbsp;
                        <span>{count}</span>
                    </div>
                ))}
            </div>
<br /> <br /> <br />
            <h1>Property Stats</h1>
            <hr />
            {/* PROPERTY STATS */}
            <div className="stats-container">

            <div className="stat-card">
                <h3>Total Properties</h3>
                <p>{totalProperties}</p>
            </div>

            <div className="stat-card">
                <h3>Available</h3>
                <p>{available}</p>
            </div>

            <div className="stat-card">
                <h3>Unavailable</h3>
                <p>{unavailable}</p>
            </div>

            </div>
        </div>
    );
}

export default AdminDashboards;