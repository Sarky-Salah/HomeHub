// client/src/component/layout/AdminSidebar.jsx

import { Link } from "react-router-dom";
import "../../styles/AdminSidebar.css";

function AdminSidebar({ open, onClose }) {

    return (
        <>
            {/* SIDEBAR */}
            <div className={`admin-sidebar ${open ? "open" : ""}`}>
                <Link to="/dashboard-admin" onClick={onClose}>AdminDashboard</Link>
                <Link to="/users" onClick={onClose}>Users</Link>
                <Link to="/user-verification" onClick={onClose}>User Verification</Link>
                <Link to="/property" onClick={onClose}>Properties</Link>
                <Link to="/uploads" onClick={onClose}>Uploads</Link>
                <Link to="/database" onClick={onClose}>Database</Link>
                <Link to="/messages" onClick={onClose}>Messages</Link>
                <Link to="/ads" onClick={onClose}>Ads</Link>
                <Link to="/visualization" onClick={onClose}>Visualization</Link>
                <Link to="/reportsandanalytics" onClick={onClose}>Reports & Analytics</Link>
                <Link to="/feedback" onClick={onClose}>Feedback</Link>
            </div>

            {open && (<div className="overlay" onClick={onClose}></div>)}
        </>
    );
}

export default AdminSidebar;